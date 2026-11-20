# @cosy/cms-editor

The single founder inline editor for all COSY sites. It replaces six divergent copies of `cms-editor.js`
(analysis: [../../docs/CMS_EDITOR_COMPARISON.md](../../docs/CMS_EDITOR_COMPARISON.md)).

**Status: built and tested here; not yet adopted by any site.** Each site still runs its own copy.

## Contract (matches the live database)

- Table `public.cms_page_overrides`: one row per page. `page_path` (PK) + `content` jsonb = `{ key: html }`.
  (The live table also has `overrides` and `content_map`; this editor ignores them.)
- Role: `profiles.role` of the signed-in user (`founder`, `admin`, `owner`). Never `localStorage`, window
  globals or `user_metadata`. The toolbar is only a convenience; row-level security (`is_founder()`) gates writes.
- HTML is cleaned with an allow-list on save **and** on render. Keys match `^[a-z0-9_-]{1,80}$`.
- Elements are addressed by `data-cms-id` (then `id`). No class selectors, no random keys. An element is
  editable when it has `data-cms-id` or `data-cms-editable="true"` (with an id).
- Saves merge into the stored map, so keys not editable on that visit are kept. Paths and size are checked
  client-side against the same limits as the database checks (`^[A-Za-z0-9_./-]+$`, 200 chars; 200,000 chars).

## Adopting it in a site (one PR per site)

1. Copy `cms-editor.js` into the site's `shared/js/` and pin it with a lock file, as for `studio-core.js`.
2. Make sure `window.supabaseClient` exists, or pass `CosyCms.init({ getClient })`.
3. Mark editable content with `data-cms-id="..."`. Sites that edited arbitrary headings and paragraphs
   (COSYevents) must add these markers: unmarked elements are deliberately not editable, because positional or
   random keys can silently attach text to the wrong element after the page changes.
4. Remove the old editor and its tests; keep a test that the page still loads the new one.

## Known differences from the old editors

- COSYevents' old editor assigned random `cms-el-xxxxxx` keys at edit time, so saved edits for unmarked
  elements could not be re-applied on the next load. Explicit keys fix that.
- Old editors that addressed elements by CSS class or selector no longer do.

Tests: `npm test` at the repository root (jsdom).
