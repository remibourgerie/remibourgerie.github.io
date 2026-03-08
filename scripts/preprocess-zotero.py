#!/usr/bin/env python3
"""
Preprocess Zotero RDF exports into a hierarchical research brain visualization JSON.

The graph is structured as a tree:
  Top-level collection → subcollections → sub-subcollections → papers

Each RDF file is one top-level collection. Subcollections form intermediate
nodes. Papers are leaf nodes connected to their parent collection(s).

Usage:
    python preprocess-zotero.py --input-dir zotero-exports/ --output ../public/research-brain.json
    python preprocess-zotero.py --input-dir zotero-exports/ --dry-run
    python preprocess-zotero.py --input-dir zotero-exports/ --min-papers 3
"""

import argparse
import json
import re
import sys
import xml.etree.ElementTree as ET
from collections import defaultdict
from datetime import datetime
from pathlib import Path


# Zotero RDF namespaces
NS_RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
NS_Z = "http://www.zotero.org/namespaces/export#"
NS_DC = "http://purl.org/dc/elements/1.1/"
NS_DCTERMS = "http://purl.org/dc/terms/"
NS_BIB = "http://purl.org/net/biblio#"
NS_FOAF = "http://xmlns.com/foaf/0.1/"

# Item types that represent papers
PAPER_TYPES = {
    f"{{{NS_BIB}}}Article",
    f"{{{NS_BIB}}}BookSection",
    f"{{{NS_BIB}}}Book",
    f"{{{NS_Z}}}ConferenceProceeding",
    f"{{{NS_BIB}}}Thesis",
    f"{{{NS_Z}}}Report",
    f"{{{NS_Z}}}Manuscript",
    f"{{{NS_Z}}}Preprint",
    f"{{{NS_Z}}}Document",
    f"{{{NS_BIB}}}Document",
}


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def parse_rdf_file(rdf_path: Path) -> tuple[dict, dict, dict]:
    """
    Parse a Zotero RDF file.

    Returns:
        papers: dict mapping paper_rdf_about -> paper metadata
        collections: dict mapping #collection_id -> {name, paper_uris, child_collection_ids}
        root_collections: dict mapping #collection_id -> collection (collections not referenced as children)
    """
    tree = ET.parse(rdf_path)
    root = tree.getroot()

    # --- Pass 1: Extract all papers ---
    papers = {}
    for elem in root:
        tag = elem.tag
        is_paper = tag in PAPER_TYPES
        if not is_paper and tag == f"{{{NS_RDF}}}Description":
            item_type = elem.find(f"{{{NS_Z}}}itemType")
            if item_type is not None and item_type.text not in ("attachment", "note", "annotation"):
                is_paper = True

        if not is_paper:
            continue

        rdf_about = elem.get(f"{{{NS_RDF}}}about", "")

        title_el = elem.find(f"{{{NS_DC}}}title")
        if title_el is None or not title_el.text:
            continue

        item = {"title": title_el.text.strip(), "rdf_about": rdf_about}

        if rdf_about:
            item["id"] = rdf_about.split("/")[-1] if "/" in rdf_about else rdf_about
        else:
            item["id"] = slugify(item["title"])[:50]

        # Authors
        authors = []
        for creator_tag in [f"{{{NS_BIB}}}authors", f"{{{NS_Z}}}creators"]:
            authors_el = elem.find(creator_tag)
            if authors_el is not None:
                seq = authors_el.find(f"{{{NS_RDF}}}Seq")
                if seq is not None:
                    for li in seq.findall(f"{{{NS_RDF}}}li"):
                        person = li.find(f"{{{NS_FOAF}}}Person")
                        if person is not None:
                            surname = person.find(f"{{{NS_FOAF}}}surname")
                            given = person.find(f"{{{NS_FOAF}}}givenName")
                            if surname is not None and surname.text:
                                initial = f"{given.text[0]}." if given is not None and given.text else ""
                                authors.append(f"{surname.text}, {initial}".strip(", "))
                        elif li.text:
                            authors.append(li.text.strip())
        item["authors"] = authors

        # Date added
        date_added_el = elem.find(f"{{{NS_DCTERMS}}}dateSubmitted")
        if date_added_el is not None and date_added_el.text:
            item["dateAdded"] = date_added_el.text[:10]

        # Date modified — fallback
        date_modified_el = elem.find(f"{{{NS_DCTERMS}}}modified")
        if date_modified_el is not None and date_modified_el.text:
            item["dateModified"] = date_modified_el.text[:10]

        # Publication date / year
        date_el = elem.find(f"{{{NS_DC}}}date")
        if date_el is not None and date_el.text:
            item["date"] = date_el.text.strip()
            year_match = re.search(r"(\d{4})", item["date"])
            if year_match:
                item["year"] = int(year_match.group(1))

        # Resolve dateAdded
        if "dateAdded" not in item:
            if "dateModified" in item:
                item["dateAdded"] = item["dateModified"]
            else:
                continue

        # Abstract
        abstract_el = elem.find(f"{{{NS_DCTERMS}}}abstract")
        if abstract_el is not None and abstract_el.text:
            text = abstract_el.text.strip()
            item["abstract"] = text[:197] + "..." if len(text) > 200 else text

        # URL
        for id_el in elem.findall(f"{{{NS_DC}}}identifier"):
            if id_el.text:
                val = id_el.text.strip()
                if val.startswith("http"):
                    item["url"] = val
                    break
                elif val.startswith("DOI "):
                    item["url"] = f"https://doi.org/{val[4:]}"
                    break
                elif val.startswith("10."):
                    item["url"] = f"https://doi.org/{val}"
                    break
            uri_el = id_el.find(f"{{{NS_DCTERMS}}}URI")
            if uri_el is not None:
                val_el = uri_el.find(f"{{{NS_RDF}}}value")
                if val_el is not None and val_el.text and val_el.text.startswith("http"):
                    item["url"] = val_el.text.strip()
                    break

        papers[rdf_about] = item

    # --- Pass 2: Extract collections with hierarchy ---
    collections = {}
    all_child_ids = set()  # Track which collections are referenced as children

    for coll in root.findall(f"{{{NS_Z}}}Collection"):
        coll_id = coll.get(f"{{{NS_RDF}}}about", "")
        title_el = coll.find(f"{{{NS_DC}}}title")
        if title_el is None or not title_el.text:
            continue

        paper_uris = []
        child_collection_ids = []

        for part in coll.findall(f"{{{NS_DCTERMS}}}hasPart"):
            resource = part.get(f"{{{NS_RDF}}}resource", "")
            if not resource:
                continue
            if resource.startswith("#collection_"):
                child_collection_ids.append(resource)
                all_child_ids.add(resource)
            else:
                paper_uris.append(resource)

        collections[coll_id] = {
            "name": title_el.text.strip(),
            "paper_uris": paper_uris,
            "child_ids": child_collection_ids,
        }

    # Root collections = those not referenced as children
    root_collections = {
        cid: coll for cid, coll in collections.items()
        if cid not in all_child_ids
    }

    return papers, collections, root_collections


def count_papers_recursive(coll_id: str, collections: dict, paper_registry: dict) -> int:
    """Count all papers in a collection and its descendants."""
    coll = collections.get(coll_id)
    if not coll:
        return 0
    count = sum(1 for u in coll["paper_uris"] if u in paper_registry)
    for child_id in coll.get("child_ids", []):
        count += count_papers_recursive(child_id, collections, paper_registry)
    return count


def main():
    parser = argparse.ArgumentParser(
        description="Preprocess Zotero RDF exports for research brain visualization",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--input-dir", "-d", required=True,
                        help="Directory of .rdf files (one per top-level collection)")
    parser.add_argument("--output", "-o", default="public/research-brain.json",
                        help="Output JSON path")
    parser.add_argument("--mapping", "-m", default=None,
                        help="Path to concept-mapping.json for custom labels/colors")
    parser.add_argument("--min-papers", type=int, default=3,
                        help="Min papers for a collection to be included (default: 3)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print stats without writing output")
    parser.add_argument("--author", "-a", default=None,
                        help="Author surname to mark as 'own' papers (e.g., 'Bourgerie')")
    parser.add_argument("--width", type=float, default=1200, help="Layout width")
    parser.add_argument("--height", type=float, default=800, help="Layout height")
    args = parser.parse_args()

    # Load concept mapping
    script_dir = Path(__file__).parent
    mapping_path = Path(args.mapping) if args.mapping else script_dir / "concept-mapping.json"
    if mapping_path.exists():
        with open(mapping_path) as f:
            mapping = json.load(f)
    else:
        mapping = {"collections": {}, "categories": {}}

    collection_map = mapping.get("collections", {})

    # Category colors
    CATEGORY_COLORS = {
        "Federated Learning": "#3F51B5",
        "Graph Learning": "#5C6BC0",
        "Decentralized Learning": "#283593",
    }
    category_palette = ["#3F51B5", "#5C6BC0", "#283593", "#7986CB", "#3949AB"]

    input_dir = Path(args.input_dir)
    rdf_files = sorted(input_dir.glob("*.rdf"))
    if not rdf_files:
        print(f"Error: No .rdf files found in {input_dir}", file=sys.stderr)
        sys.exit(1)

    def is_own_paper(paper: dict) -> bool:
        if not args.author:
            return False
        al = args.author.lower()
        return any(al in a.lower() for a in paper.get("authors", []))

    # ---- Parse all RDF files ----
    paper_registry: dict[str, dict] = {}
    # All nodes: papers + collections
    output_nodes = []  # list of node dicts
    output_edges = []  # list of edge dicts
    node_ids = set()

    print(f"Found {len(rdf_files)} RDF files:\n")

    for file_idx, rdf_file in enumerate(rdf_files):
        category_name = rdf_file.stem
        category_color = CATEGORY_COLORS.get(
            category_name,
            category_palette[file_idx % len(category_palette)]
        )
        category_slug = slugify(category_name)

        papers_in_file, collections, root_collections = parse_rdf_file(rdf_file)

        # Register papers
        for rdf_about, paper in papers_in_file.items():
            if rdf_about not in paper_registry:
                paper_registry[rdf_about] = paper

        print(f"  {rdf_file.name}: {len(papers_in_file)} papers, "
              f"{len(collections)} collections, {len(root_collections)} root collections")

        # Create top-level category node
        top_node_id = f"cat-{category_slug}"
        if top_node_id not in node_ids:
            output_nodes.append({
                "id": top_node_id,
                "type": "category",
                "label": category_name,
                "category": category_name,
                "color": category_color,
                "paperCount": 0,  # will compute later
                "depth": 0,
            })
            node_ids.add(top_node_id)

        # Process collections recursively
        def process_collection(coll_id: str, parent_node_id: str, depth: int):
            coll = collections.get(coll_id)
            if not coll:
                return

            # Count papers recursively for filtering
            total_papers = count_papers_recursive(coll_id, collections, paper_registry)
            if total_papers < args.min_papers:
                return

            coll_node_id = f"{category_slug}-{slugify(coll['name'])}-{coll_id.replace('#', '')}"
            config = collection_map.get(coll["name"], {})
            label = config.get("label", coll["name"])

            if coll_node_id not in node_ids:
                output_nodes.append({
                    "id": coll_node_id,
                    "type": "collection",
                    "label": label,
                    "category": category_name,
                    "color": category_color,
                    "paperCount": total_papers,
                    "depth": depth,
                })
                node_ids.add(coll_node_id)

            # Edge from parent to this collection
            output_edges.append({
                "source": parent_node_id,
                "target": coll_node_id,
                "type": "hierarchy",
            })

            # Connect direct papers to this collection
            for paper_uri in coll["paper_uris"]:
                paper = paper_registry.get(paper_uri)
                if not paper:
                    continue
                paper_node_id = f"paper-{paper['id']}"
                if paper_node_id not in node_ids:
                    output_nodes.append({
                        "id": paper_node_id,
                        "type": "paper",
                        "title": paper["title"],
                        "authors": paper.get("authors", []),
                        "dateAdded": paper["dateAdded"],
                        "year": paper.get("year", 0),
                        "abstract": paper.get("abstract"),
                        "url": paper.get("url"),
                        "category": category_name,
                        "color": category_color,
                        "depth": depth + 1,
                        "isOwn": is_own_paper(paper),
                    })
                    node_ids.add(paper_node_id)

                output_edges.append({
                    "source": coll_node_id,
                    "target": paper_node_id,
                    "type": "contains",
                })

            # Process child collections
            for child_id in coll.get("child_ids", []):
                process_collection(child_id, coll_node_id, depth + 1)

        # Process root collections
        for coll_id in root_collections:
            process_collection(coll_id, top_node_id, 1)

        # Papers not in any collection → connect directly to category
        all_collection_papers = set()
        for coll in collections.values():
            all_collection_papers.update(coll["paper_uris"])
        for rdf_about, paper in papers_in_file.items():
            if rdf_about not in all_collection_papers:
                paper_node_id = f"paper-{paper['id']}"
                if paper_node_id not in node_ids:
                    output_nodes.append({
                        "id": paper_node_id,
                        "type": "paper",
                        "title": paper["title"],
                        "authors": paper.get("authors", []),
                        "dateAdded": paper["dateAdded"],
                        "year": paper.get("year", 0),
                        "abstract": paper.get("abstract"),
                        "url": paper.get("url"),
                        "category": category_name,
                        "color": category_color,
                        "depth": 1,
                        "isOwn": is_own_paper(paper),
                    })
                    node_ids.add(paper_node_id)
                output_edges.append({
                    "source": top_node_id,
                    "target": paper_node_id,
                    "type": "contains",
                })

    # Update category paperCount
    for node in output_nodes:
        if node["type"] == "category":
            cat = node["label"]
            node["paperCount"] = sum(
                1 for n in output_nodes if n["type"] == "paper" and n["category"] == cat
            )

    # Assign timeSteps to papers (grouped by month)
    paper_nodes = [n for n in output_nodes if n["type"] == "paper"]
    paper_nodes.sort(key=lambda p: p["dateAdded"])
    time_step_map = {}
    current_step = 0
    for paper in paper_nodes:
        month_key = paper["dateAdded"][:7]
        if month_key not in time_step_map:
            time_step_map[month_key] = current_step
            current_step += 1
        paper["timeStep"] = time_step_map[month_key]

    # For non-paper nodes, set timeStep to earliest paper's timeStep
    # (the collection appears when its first paper appears)
    node_map = {n["id"]: n for n in output_nodes}
    for node in output_nodes:
        if node["type"] != "paper":
            # Find earliest paper descendant via edges
            earliest = current_step
            children = [e["target"] for e in output_edges if e["source"] == node["id"]]
            queue = list(children)
            visited = set()
            while queue:
                child_id = queue.pop(0)
                if child_id in visited:
                    continue
                visited.add(child_id)
                child = node_map.get(child_id)
                if child and child["type"] == "paper" and "timeStep" in child:
                    earliest = min(earliest, child["timeStep"])
                elif child:
                    queue.extend(e["target"] for e in output_edges if e["source"] == child_id)
            node["timeStep"] = earliest

    total_steps = current_step
    total_papers = len(paper_nodes)
    total_collections = sum(1 for n in output_nodes if n["type"] in ("category", "collection"))

    # ---- Stats ----
    date_start = paper_nodes[0]["dateAdded"] if paper_nodes else ""
    date_end = paper_nodes[-1]["dateAdded"] if paper_nodes else ""

    print(f"\n{'='*60}")
    print(f"  Total nodes:       {len(output_nodes)}")
    print(f"    Papers:          {total_papers}")
    print(f"    Collections:     {total_collections}")
    print(f"  Total edges:       {len(output_edges)}")
    print(f"    Hierarchy edges: {sum(1 for e in output_edges if e['type'] == 'hierarchy')}")
    print(f"    Contains edges:  {sum(1 for e in output_edges if e['type'] == 'contains')}")
    print(f"  Time steps:        {total_steps} months ({date_start} to {date_end})")

    # Print tree structure
    print(f"\n  Graph hierarchy:")
    for node in output_nodes:
        if node["type"] == "category":
            indent = "    "
            pc = node.get("paperCount", 0)
            print(f"{indent}{node['label']} ({pc} papers)")

            # Print children
            def print_tree(parent_id, depth):
                children = [
                    node_map[e["target"]]
                    for e in output_edges
                    if e["source"] == parent_id and e["type"] == "hierarchy"
                    and e["target"] in node_map
                ]
                children.sort(key=lambda c: -c.get("paperCount", 0))
                for child in children:
                    prefix = "    " + "  " * depth
                    pc = child.get("paperCount", 0)
                    print(f"{prefix}├─ {child['label']} ({pc} papers)")
                    print_tree(child["id"], depth + 1)

            print_tree(node["id"], 1)

    if args.dry_run:
        print(f"\n{'='*60}")
        print("Dry run complete. No output written.")
        return

    # ---- Build output ----
    output = {
        "meta": {
            "generatedAt": datetime.now().astimezone().isoformat(),
            "totalPapers": total_papers,
            "totalCollections": total_collections,
            "totalNodes": len(output_nodes),
            "timeRange": {"start": date_start, "end": date_end},
            "timeSteps": total_steps,
        },
        "nodes": output_nodes,
        "edges": output_edges,
    }

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nWritten to {output_path} ({output_path.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
