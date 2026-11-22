# Founder CMS editor: comparison of the six copies

Status: analysis only. No editor was changed. Surveyed 2026-11-19 from the default branch of each
repository (`shared/js/cms-editor.js`). Sanitizer status updated 2026-11-22. This is the input to Phase 4 of
[ECOSYSTEM_REORG_PLAN.md](./ECOSYSTEM_REORG_PLAN.md).

## What was found

| Copy | Lines | Who sees the toolbar (client-side) | HTML cleaning | Table shape it writes |
|---|---|---|---|---|
| COSYevents | 444 | `COSY_USER.role` / `CosyAuth.role()`, normalised | DOMPurify (vendored), on render **and** save; keys must match `^[a-z0-9_-]+$` | `page_path` (PK), `content` jsonb |
| COSYgames | 398 | `COSY_USER.app_metadata.role` only | own function, 5,000-char cap, on render and save | `pathname`, `content_overrides` |
| COSYtools | 423 | user, `user_metadata`, `app_metadata`, **`localStorage` `cosy_role` / `COSY_USER`** | allow-list that rebuilds a clean tree, on render and save | `page_path` + `selector`, `content` |
| COSYmanuals | 275 | `user_metadata.role`, `app_metadata.role`, `user.role`, `COSY_USER.role` | allow-list, on render **and** save | `page_path` + `element_id`, `content_html` |
| COSYplatform | 332 | `COSY_USER.role`, then `profiles.role` from the database | allow-list, on render **and** save | `page_path` (PK), `overrides` jsonb |
| COSYplatform-source | 414 | same as COSYplatform | allow-list, on render **and** save | same as COSYplatform |

## Findings, most important first

1. **Three editors originally applied saved HTML to the page with no cleaning** (manuals, platform, platform-source). All three now use the platform allow-list sanitizer on render and save; the source editor was the last to be fixed. Verify the deployed copies before adopting the shared package.
   Overrides are readable by everyone, so whatever a founder-level account saves runs for every visitor.
   All COSY sites share one origin, so script injected on one site can reach the sessions of the others
   (COSYtools' own sanitizer comment says the same). The write path is limited to founder roles by
   row-level security where that could be checked (see 3), so this needs a compromised or mistaken
   founder-level account, not an anonymous visitor. It is still the largest gap.
2. **The plan's premise "all six write to the same table" is wrong in the details.** They share a table
   name but assume four incompatible shapes (see the last column). At most one shape can match any given
   database.
3. **Only two shapes have a migration in the repositories I could read.** COSYevents' migrations create
   `page_path` + `content` (with a 200 KB size check and a path-pattern check); COSYplatform-source's
   migration 0008 creates `page_path` + `overrides`. I found **no migration** for the games
   (`pathname`), tools (`selector`) or manuals (`element_id`) shapes. Either those tables exist only in a
   Supabase project I cannot see, or those editors' save buttons fail. This is unverified and needs
   someone with database access to check.
4. **Client-side role checks differ and two trust browser-controlled values.** Tools reads
   `localStorage`; manuals and tools read `user_metadata`, which a signed-in user can edit themselves in
   Supabase Auth. The editors only use this to decide whether to show the toolbar, and writes are meant to
   be stopped by row-level security, so this is a weak check rather than a bypass, but it must not be the
   one that is copied forward. The platform editors, which ask the database for `profiles.role`, are the
   safest of the six on this point.
5. **Strictest checks live in different copies**: key validation and DOMPurify in events, tree-rebuilding
   allow-list in tools, a length cap in games, server-side role lookup in platform. No copy has all of them.

## Not checked

- Whether users can change their own `profiles.role` (this decides how strong the platform check is).
- The live Supabase projects: which table shapes exist, and the row-level-security policies on them.
- Whether COSYplatform and COSYplatform-source ever differ in behaviour beyond line offsets.

## Proposed contract for one shared editor (for decision, not built)

- **Role:** ask the database for the signed-in user's role; never read `localStorage` or `user_metadata`.
  Founder roles are `founder`, `admin`, `owner` (same set as `studio-core`).
- **Cleaning:** on save **and** on render, with the tools-style allow-list or DOMPurify. Port events'
  key pattern and size limits.
- **Table:** one shape. Events' (`page_path` PK, `content` jsonb, size and path checks) already has a
  migration and tests in `COSYevents/supabase/tests/access_rules.sql`. The other repositories would
  migrate to it.
- **Order of work:** (1) a cleaning step on render in the three unclean editors, which needs no schema
  change; (2) confirm the live table shapes; (3) build the shared package and replace the copies.
