CREATE OR REPLACE FUNCTION public.generate_bibtex()
RETURNS TRIGGER AS $$
DECLARE
  entry_type TEXT;
  venue_field TEXT;
  citation_key TEXT;
  first_author_lastname TEXT;
  first_title_word TEXT;
  author_list TEXT;
  bibtex TEXT;
BEGIN
  -- Determine entry type
  IF NEW.publication_type = 'Journal' THEN
    entry_type := 'article';
    venue_field := 'journal';
  ELSIF NEW.publication_type IN ('Conference', 'Workshop') THEN
    entry_type := 'inproceedings';
    venue_field := 'booktitle';
  ELSE
    entry_type := 'misc';
    venue_field := 'booktitle';
  END IF;

  -- Build citation key: firstAuthorLastname + year + firstTitleWord
  -- Use translate() to strip diacritics (no extension needed)
  -- Use array indexing to get last element (split_part doesn't support -1 in Postgres)
  first_author_lastname := regexp_replace(
    lower(translate(
      (string_to_array(NEW.authors[1], ' '))[array_length(string_to_array(NEW.authors[1], ' '), 1)],
      'àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ',
      'aaaaaaaceeeeiiiidnoooooouuuuybyaaaaaaaceeeeiiiidnooooooouuuuyb'
    )),
    '[^a-z0-9]', '', 'g'
  );
  first_title_word := regexp_replace(
    lower(translate(
      split_part(NEW.title, ' ', 1),
      'àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ',
      'aaaaaaaceeeeiiiidnoooooouuuuybyaaaaaaaceeeeiiiidnooooooouuuuyb'
    )),
    '[^a-z0-9]', '', 'g'
  );
  citation_key := first_author_lastname || NEW.year::TEXT || first_title_word;

  -- Build author list joined with ' and '
  SELECT string_agg(unnested, ' and ' ORDER BY ord)
  INTO author_list
  FROM unnest(NEW.authors) WITH ORDINALITY AS t(unnested, ord);

  -- Assemble BibTeX
  bibtex := '@' || entry_type || '{' || citation_key || ',' || E'\n' ||
            '  author = {' || author_list || '},' || E'\n' ||
            '  title = {' || NEW.title || '},' || E'\n' ||
            '  ' || venue_field || ' = {' || NEW.journal || '},' || E'\n' ||
            '  year = {' || NEW.year::TEXT || '},' || E'\n' ||
            '}';

  NEW.citation_key := bibtex;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_bibtex ON public.publications;

CREATE TRIGGER trg_generate_bibtex
BEFORE INSERT OR UPDATE ON public.publications
FOR EACH ROW
EXECUTE FUNCTION public.generate_bibtex();

-- Backfill existing rows
UPDATE public.publications SET updated_at = now();
