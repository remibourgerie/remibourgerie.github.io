# Google Scholar Synchronization System

## Overview

This system synchronizes publications from Google Scholar while preserving all manually curated data. It uses smart deduplication based on Google Scholar's unique identifiers.

## Key Features

✅ **Deduplication** - Uses `scholar_id` (SerpAPI's `result_id`) as the primary key
✅ **Preserves Manual Data** - Only updates citation counts, never overwrites URLs, PDFs, tags, etc.
✅ **Fallback Matching** - Falls back to `(title, year)` matching for existing publications
✅ **Sync Statistics** - Shows how many publications were added, updated, or had errors
✅ **Tracking** - Records when each publication was last synced

## Database Schema

### New Columns Added to `publications` Table

| Column | Type | Description |
|--------|------|-------------|
| `scholar_id` | TEXT UNIQUE | SerpAPI `result_id` - Google Scholar's unique publication identifier |
| `scholar_cluster_id` | BIGINT | Google Scholar's cluster ID (groups different versions of same paper) |
| `last_synced_at` | TIMESTAMPTZ | Timestamp of last citation sync from Google Scholar |

### Indexes

- `idx_publications_scholar_id` - Fast lookup by Scholar ID
- `idx_publications_title_year` - Fallback matching by title and year

## How the Sync Works

### 1. **Fetch Publications from Google Scholar**
   - Calls SerpAPI through the `fetch-scholar-publications` Supabase function
   - Retrieves publications with their metadata, including:
     - `result_id` (stored as `scholar_id`)
     - `cluster_id` (stored as `scholar_cluster_id`)
     - Citation counts
     - Basic metadata (title, authors, venue, year, etc.)

### 2. **Smart Deduplication**
   For each publication from Scholar:

   **Step 1:** Try to find existing publication by `scholar_id`
   ```typescript
   SELECT * FROM publications WHERE scholar_id = '<result_id>'
   ```

   **Step 2:** If not found, try matching by `(title, year)`
   ```typescript
   SELECT * FROM publications WHERE title = '<title>' AND year = <year>
   ```

### 3. **Update Strategy**

   **If publication exists:**
   - ✅ **UPDATE**: `citations`, `scholar_id`, `scholar_cluster_id`, `last_synced_at`
   - ❌ **PRESERVE**: All other fields (URLs, PDFs, tags, abstract, publication_type, research_areas, etc.)

   **If publication is new:**
   - ✅ **INSERT**: Full record with all available data from Scholar
   - Automatically extract tags from title
   - Set `last_synced_at` to current timestamp

### 4. **Sync Statistics**
   The UI displays:
   - **New publications** added
   - **Updated citations** for existing publications
   - **Errors** encountered during sync

## Code Structure

### Files Modified

1. **Database Migration**
   - `supabase/migrations/20251027000000_add_scholar_tracking.sql`
   - Adds new columns and indexes

2. **API Function**
   - `supabase/functions/fetch-scholar-publications/index.ts`
   - Extracts `result_id` and `cluster_id` from SerpAPI response

3. **TypeScript Types**
   - `src/integrations/supabase/types.ts`
   - Adds new columns to database schema types

4. **Frontend Component**
   - `src/components/GoogleScholarIntegration.tsx`
   - Implements smart upsert logic
   - Shows sync statistics
   - Handles errors gracefully

5. **Publication Interface**
   - `src/components/PublicationManager.tsx`
   - Adds `scholarId`, `scholarClusterId`, `lastSyncedAt` fields

## Usage

### Running a Sync

1. **Apply the database migration** (if using Supabase CLI):
   ```bash
   supabase db reset
   # or
   supabase migration up
   ```

2. **Configure SerpAPI Key** in Supabase:
   - Set `SERPAPI_API_KEY` environment variable in Supabase dashboard

3. **Click "Sync Now"** in the Admin panel
   - The system will fetch publications from Google Scholar
   - Deduplicate based on `scholar_id` or `(title, year)`
   - Update only citation counts for existing publications
   - Insert new publications

### Example Workflow

**Scenario 1: New Publication**
- Paper appears on Google Scholar for the first time
- System inserts full record with Scholar metadata
- `scholar_id` is stored for future syncs

**Scenario 2: Existing Publication (with Scholar ID)**
- Paper was previously synced
- System finds it by `scholar_id`
- Only updates `citations` and `last_synced_at`
- All manual data (PDFs, tags, etc.) preserved

**Scenario 3: Manually Added Publication (no Scholar ID)**
- Paper was manually added before first sync
- System matches by `(title, year)`
- Updates `citations` and adds `scholar_id` for future syncs
- Preserves all manually entered data

## Important Notes

⚠️ **Data Preservation**
- The system **NEVER** overwrites:
  - PDF URLs
  - Poster URLs
  - Code URLs
  - Tags (except for new publications)
  - Abstracts (except for new publications)
  - Publication types
  - Research areas
  - Any other manually curated fields

⚠️ **Only Citation Counts Updated**
- For existing publications, **only** the `citations` field is updated
- This ensures manual curation is not lost

⚠️ **Unique Constraint**
- `scholar_id` has a UNIQUE constraint
- Prevents duplicate entries from Scholar

## Testing

To test the sync without affecting production data:

1. Use a test Supabase project
2. Run the migration
3. Add a few test publications manually
4. Run sync and verify:
   - Citations are updated
   - Manual data is preserved
   - New publications are added
   - No duplicates created

## Troubleshooting

**Sync fails with API error:**
- Check that `SERPAPI_API_KEY` is set in Supabase
- Verify Scholar ID is correct ('T3J6BMcAAAAJ')
- Check SerpAPI credits

**Duplicates created:**
- Verify migration was applied (check for `scholar_id` column)
- Check that `scholar_id` is being extracted from SerpAPI response

**Citations not updating:**
- Check browser console for errors
- Verify publication has a `scholar_id` or matching `(title, year)`
- Check `last_synced_at` field to see if sync occurred
