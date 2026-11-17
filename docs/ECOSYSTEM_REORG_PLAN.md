# COSY Ecosystem Reorganisation Plan

Status: **proposal — not yet approved.** Nothing in this document has been executed.
Owner: to be assigned.
Last surveyed: 2026-11-17 (all 13 repositories under `cosylanguages/`, read-only).

---

## 1. Purpose

The ecosystem grew to 13 repositories with no shared ownership of the things they
all duplicate. This document records what is actually there, proposes one target
layout, and sets an order of work that is safe to run one repository at a time.

It does not propose a rewrite. Every step below is either a deletion of dead
weight or a move of existing, working files.

---

## 2. The decision that has to come first

Right now the ecosystem is 13 separate repositories. The question is how much to
change that.

**Option A — keep 13 repositories, clean up what is inside them (recommended).**
Each product keeps its own repository and its own live website. We only fix the
duplication: the six copies of the CMS editor become one, the copied CSS files become
one, and the studios move into `COSYstudio`. Nothing about how the sites are served
changes, and no URL changes.

**Option B — merge everything into one big repository.**
One repository holding all the products in subfolders. It removes duplication
completely, but every product's website would have to be rebuilt and redeployed from
the new location, all 13 repositories would need migrating at once, and it breaks the
current rule that each thing lives in the repository that owns it. It is a much bigger
and riskier job for a similar end result.

Recommendation: **Option A.** It fixes the real problems (duplication and drift) with
work that can be done one repository at a time and checked as it goes.

In plain terms: Option A is "tidy the house". Option B is "knock down the house and
rebuild it".

---

## 2b. Who owns the shared layer

"Shared layer" means the files that more than one product needs: the design tokens,
the base CSS, the CMS editor, the studio kernel.

Today nobody owns them. That is the actual problem. Each repository keeps its own
copy, so there are six CMS editors, four `base.css` files, and so on. When one copy is
fixed, the others are not. That is why the six CMS editors have all drifted apart.

"Who owns it" just means: **when a shared file needs a change, whose pull request is
it, and who approves it?** Somebody has to be the owner, or the copies drift again.

The proposal is that `COSYstudio` owns them, and the work is: move each shared file
there once, then have the products use that one copy instead of keeping their own.

This is a process question, not a technical one. It needs one name: the person who
reviews changes to shared files. It can be you. If there is only one maintainer, the
answer is simply "the founder", and this decision is already made.

---

## 3. Current state (evidence)

### 3.1 Repository inventory

| Repository | Size | Files | Pages | Last push | Notes |
|---|---|---|---|---|---|
| COSYstudio | 364K | 16 | yes | 2026-10-29 | Spec only: no UI, no CI |
| COSYdata | 68M | 2432 | yes | 2026-11-17 | Canonical datasets |
| COSYevents | 62M | 1148 | yes | 2026-11-16 | Events Studio |
| COSYgames | 19M | 411 | yes | 2026-11-12 | 20 games + CMS editor |
| COSYlanguages | 5.5M | 172 | yes | 2026-11-16 | Gateway (source of truth) |
| COSYlanguagesss | 333M | 2460 | yes | 2026-11-12 | **Legacy** — old COSYlanguages, planned for deletion |
| COSYmagazine | 24M | 464 | yes | 2026-11-16 | Magazine Studio |
| COSYmanuals | 84M | 5466 | yes | 2026-11-16 | Manuals Studio |
| COSYplatform | 5.9M | 233 | yes | 2026-11-17 | Lesson Studio (app) |
| COSYplatform-source | 33M | 1749 | **no** | 2026-10-15 | **Legacy** — old COSYplatform, planned for deletion |
| COSYpractice | 43M | 474 | yes | 2026-11-16 | Practice engine |
| COSYtools | 83M | 856 | yes | 2026-11-16 | Reference engines |
| COSYworld | 15M | 245 | yes | 2026-11-12 | Open-world RPG |

### 3.2 Studios

Six real authoring studios exist, in five different shapes, with no shared contract.

| Studio | Repository | Entry point | Core files | Lines | Who may use it | How it publishes |
|---|---|---|---|---|---|---|
| Events Studio | COSYevents | `studio.html` | `shared/js/studio.js`, `styles/studio.css` | ~5,140 | founder/admin/owner | Export JSON/MD, then a GitHub Action opens a PR |
| Lesson Studio | COSYplatform | `lesson-studio.html` | `shared/js/lesson-studio.js`, `studio-games.js`, `studio-media.js`, `shared/css/lesson-studio.css` | ~5,450 | signed-in teacher | Draft and publish to a course through Supabase |
| Studio Results | COSYplatform | `studio-results.html` | inline + Supabase RPC | ~86 | teacher | Read-only analytics |
| Manuals Studio | COSYmanuals | `shared/studio/studio.html` | `manual-studio.js`, `manual-core.js`, `manual-studio.css` | ~640 | local only | Publishes nothing; exports files |
| Magazine Studio | COSYmagazine | `editor.html` | `js/editor.js`, `editor-blocks.js`, `issue-studio.js`, `cms-auth.js` | ~470 + editor | founder/admin/owner | Build to static pages, in-browser PDF upload |
| Print Studio | COSYlanguages **and** COSYlanguagesss | `print-studio/` | `print-cards.html`, `print-zine.html`, `print-box.html`, `print-boardgame.html`, `print-grammar.html` (sss only) | ~1,715 / ~2,151 | none (static) | Browser print, pulls live COSYdata |

`COSYstudio` is the intended central home for these. Today it holds the ULO schema
(`schemas/ulo.schema.json`, `schemas/blocks.schema.json`) and roughly 350 lines of
TypeScript (types, CID helper, validator, transformer). It has no HTML and no CI.
Its README describes twelve modules and twenty-one AI actions that do not exist yet.

### 3.3 Duplication found

Verified by content hash.

| File | Copies | Are they identical? | Repositories |
|---|---|---|---|
| `cms-editor.js` (Founder visual CMS) | 6 | **No — all six differ** | COSYevents, COSYgames, COSYmanuals, COSYplatform, COSYplatform-source, COSYtools |
| `studio-core.js` (studio kernel) | 2 | Yes (md5 `9f4293bd…`) | COSYmagazine, COSYmanuals |
| `base.css` | 4 | Yes | COSYlanguages, COSYlanguagesss, COSYmagazine, COSYpractice |
| `layout.css` | 3 | Yes | COSYlanguages, COSYmagazine, COSYpractice |
| `cosy-icons.css` | 4 | Yes | COSYevents, COSYgames, COSYtools, COSYworld |
| `design-tokens.css` | 2 | Yes | COSYevents, COSYworld |
| `tokens.css` | 2 | Yes | COSYplatform, COSYplatform-source |
| `vocab-resolver.js`, `ui-toast.js`, `lazy-script.js`, `tools-resolver.js`, `manuals-resolver.js`, `irregular-verbs.js` | 2 | Yes | COSYplatform, COSYplatform-source |
| `curriculums/*.js`, `workbook_data.js`, `vocabulary-template.js` | 2 | Yes | COSYmanuals, COSYplatform-source |
| Print Studio pages | 2 | **No — drifted** | COSYlanguages, COSYlanguagesss |
| `cosy-tokens.css` | 3 | **No — three different files** | COSYgames, COSYtools, COSYworld |

The six `cms-editor.js` copies are the largest single problem: about 2,200 lines of
duplicated authentication and HTML-sanitisation logic, all writing to the same
Supabase table `cms_page_overrides`, and each copy drifting on its own. This is a
security-sensitive surface (role checks, key validation, sanitisation), so divergence
here is a risk, not just untidiness.

### 3.4 Structural problems

1. **`COSYstudio` is a plan, not a product.** It cannot absorb anything yet.
2. **`COSYlanguagesss` is the old `COSYlanguages`.** It is a near-duplicate gateway
   with its own Pages site and is planned for deletion. `COSYlanguages/AGENTS.md`
   already flags it as out-of-band. Because it is a superset snapshot, it also holds
   copies of content owned elsewhere — it shares hundreds of files with
   `COSYpractice` (for example the whole confusion-pair set) and one file with
   `COSYmanuals`. Deletion must therefore be preceded by a sweep for anything that
   exists only there.
3. **`COSYplatform-source` is the old `COSYplatform`.** It is stale, has no Pages
   site, and is planned for deletion. It overlaps the current `COSYplatform` (six
   identical shared JS files) and `COSYmanuals` (identical curriculum and workbook
   data). Same caveat: sweep for content that exists only there before deleting.
4. **The studio kernel is vendored, not shared.** `studio-core.js` says so in its
   own header.
5. **Design tokens are copied** rather than imported, and three of the copies have
   already diverged.
6. **The one shared-import mechanism that exists is under-used.** COSYplatform-source
   imports `cosy-tokens.css` and a logo from a pinned COSYlanguages commit
   (`raw.githubusercontent.com/.../f59a291e…`). That is the right pattern; almost
   nothing else follows it.

---

## 4. Target architecture (Option A)

One shared layer, in `COSYstudio`.

The important correction: **studio access is not controlled by where the code lives.**
Every studio is reached only by a signed-in founder, and the gate is Supabase — a
founder login plus row-level security (`is_founder` policies, present across the
studio migrations). `studio-core.js` states this in its own header: "The real gate for
publishing is always the database (row level security)."

So moving studio code into `COSYstudio` does not change who can use a studio. The
files may be publicly readable and it would still be safe, because the data behind
them is not. This removes the need for any public/private split of the studios.

### 4.1 One caveat, and only one

If the `COSYstudio` repository is private, then a public page cannot import a file
from it (a browser cannot read `raw.githubusercontent.com` for a private repo).

That matters for exactly one thing: the handful of assets that *public* pages load —
design tokens and base CSS. Those must stay in a public repository. `COSYlanguages`
is public, already serves them, and is the natural home.

Everything else — studios, schemas, the studio kernel — has no public consumer, so it
can live in `COSYstudio` either way.

| Layer | Repository | Owns |
|---|---|---|
| Shared platform | **COSYstudio** | Studios, ULO and block schemas, studio kernel, content pipeline tooling |
| Public shared assets | COSYlanguages | Design tokens, base CSS, shared components |
| Gateway | COSYlanguages | Hub, placement quiz, course catalogue |
| Products | practice, tools, games, events, magazine, manuals, world, platform | Their own content and engines |
| Data | COSYdata | Canonical datasets |

Every product keeps its own repository, its own Pages site, and its own URL. Each
shared file gets exactly one home.

---

## 5. Migration plan

Ordered so that each step is independently reviewable and reversible. Steps 0 and 1
carry no functional risk.

### Phase 0 — Freeze and document (no code moves)
- Land this document.
- Add a one-page "where does X live?" decision table to each affected README so the
  boundary is written down before anything moves.

### Phase 1 — Delete the legacy repositories
Both legacy repositories are decided for deletion. They are **not** duplicates of their
replacements, so deleting them blind would lose content. An orphan sweep was run and
the results are in section 8.2.

The finding: of 1,747 files in `COSYplatform-source`, 1,638 exist nowhere else in the
target repositories. Of 2,460 files in `COSYlanguagesss`, 1,978 exist nowhere else.
These are not stray copies; they are content with no current home.

Each repository gets the same treatment.

1. **Classify the orphans.** Split them into (a) content that should move, (b)
   generated output that can be regenerated, and (c) genuine junk. Only (a) is work.
   The `project/docs/` pass is done and is recorded in section 8.3.
2. **Complete the vocabulary import first.** Roughly 4,400 classified entries exist only
   in `COSYlanguagesss` and are not yet in `COSYdata` (section 8.4). This is the one
   step that genuinely blocks deletion, because the destination was already chosen.
3. **Re-home the keepers.** Move each into the repository that owns that content now,
   as its own reviewed change. `COSYmanuals/docs/from-cosylanguages/` is the precedent,
   though section 8.3 shows that rescue was partly lossy and needs re-verification.
4. **Archive, then delete.** Archive first so the repository becomes read-only and its
   Pages URL keeps resolving; delete only after an agreed period and a link check.

Order: `COSYplatform-source` first (no Pages site, so no live URL to preserve, and its
orphans are content rather than data with a chosen destination), `COSYlanguagesss`
second (it has a Pages site and it holds the vocabulary import blocker).

This is the largest clarity win, but it is **not** the lowest-risk step, because it
depends on classifying roughly 3,600 files. That classification is the real work of
this phase.

### Phase 2 — Make the shared layer real
- Move `studio-core.js` into `COSYstudio/packages/studio-core`, with the existing
  tests from `COSYmagazine/tests/test_studio_core.mjs`.
- Keep the ULO and block schemas beside it.
- Leave the public shared assets (design tokens, base CSS) in `COSYlanguages`, which is
  public and already serves them. They cannot move to a private `COSYstudio`, because
  public pages load them.
- Add a CI check that every pinned URL resolves, so a dead pin cannot be committed
  again (see section 8.1).

### Phase 3 — Consolidate the studios
Move the studios into `COSYstudio/studios/<name>/` behind one entry page. Order,
easiest first:

1. **Print Studio** — already earmarked for this move by the repository's own audit
   (`DUP-003`, `ARCH-01`). Static, no backend, lowest risk.
2. **Manuals Studio** — local-only, publishes nothing, already depends on the kernel.
3. **Magazine Studio** — already depends on the kernel.
4. **Events Studio** — self-contained, publishes through a GitHub Action.
5. **Lesson Studio** — last, because it is coupled to the platform's Supabase schema
   and student pages.

### Phase 4 — Collapse the CMS editors (highest value)
Replace the six `cms-editor.js` copies with one implementation in
`COSYstudio/packages/cms-editor`, imported by pinned URL. Before replacing, reconcile
the six behaviours into one contract (role set, key pattern, sanitisation rules) and
port the strictest checks. This step removes roughly 1,800 lines and closes a real
security divergence.

### Phase 5 — Guards
- Add a CI check in each repository that fails when a shared file is copied back in
  instead of imported.
- Add the same pinned-URL check COSYgames already has (`tests/site-urls.test.js`),
  which already guards against mistyped site names such as `COSYlanguagesss`.

---

## 6. Open decisions (blocking)

1. **Option A or Option B?** Section 2. Recommendation: A.
2. **Legacy deletion window**: how long should an archived repository sit read-only
   before it is deleted? Section 5, Phase 1.
3. **Vocabulary import**: ~4,400 entries classified by COSYdata as `dictionary-word` or
   `phrase/idiom` exist only in `COSYlanguagesss` and were never imported. Complete the
   import, or accept the loss? Section 8.4. This blocks deleting `COSYlanguagesss`.
4. **The 32 audit reports** in `COSYlanguagesss/project/docs/audits/`: archive them, or
   delete them? Section 8.3.

Resolved:
- `COSYlanguagesss` and `COSYplatform-source` are the old `COSYlanguages` and
  `COSYplatform` respectively, and both are planned for deletion. Phase 1 treats them
  accordingly.
- **Studio access is gated by Supabase, not by repository location.** Every studio is
  reached only by a signed-in founder, enforced by `is_founder` row-level security.
  Section 4 reflects this: no public/private split of the studios is needed.
- **Shared-layer ownership**: if the founder is the only maintainer, the founder owns
  it, and this is already decided. Section 2b.

---

## 7. Non-goals

- No rewrite of any studio's behaviour. Phase 3 moves files; it does not redesign them.
- No change to public URLs. Products keep their Pages sites throughout.
- No change to linguistic data or its schemas.
- No new repository unless a decision in section 6 requires one.

---

## 8. Risks

| Risk | Mitigation |
|---|---|
| Pinned-URL imports break if the commit is gone | Import by immutable commit SHA and check it resolves in CI. See section 8.1 |
| A private repo is imported by a public page | Keep the public assets (tokens, base CSS) in `COSYlanguages`; never import those from `COSYstudio` if it is private |
| Archiving a repository breaks inbound links | Diff and grep for inbound links first; archive (not delete) so URLs keep resolving |
| The six CMS editors have real behavioural differences | Reconcile into one contract and port the strictest checks before replacing |
| Moving studios breaks their Supabase coupling | Move Lesson Studio last, after the shared package boundary is proven |
| Two repositories both claim the same content | Decide which repository owns that content in Phase 1, before any move |

### 8.1 Live findings that need a fix regardless of this plan

**Dead pinned imports.** Nineteen files import from COSYlanguages commit
`f59a291e8929a116b0c7d96505d67da7c16b287a`, which no longer exists (the API returns
`422`). Two files also import from `ba14a13d3c32e84f5c8ebbabd2d8b85c060d04a4`, which
is equally dead. One further file references a placeholder SHA
(`a1b2c3d4…abcdef…`) that never existed.

Impact today is limited, because every affected file sits in a legacy repository
(`COSYplatform-source`, `COSYlanguagesss`) or in a comment-only reference
(`COSYmanuals` bootcamp pages). But it is the exact failure mode the pinned-URL
pattern is supposed to avoid, and it is live in the plan's own recommended mechanism.

The lesson is that a pinned SHA must be verified at the moment it is written and
checked by CI thereafter. Phase 5 should include a check that every pinned URL
resolves.

**`COSYstudio` is public with Pages enabled.** The repository is `public`, Pages is
enabled, and `https://cosylanguages.github.io/COSYstudio/` returns `200`. This is
harmless for the studios, because they are gated by Supabase rather than by repository
visibility. It is worth confirming it is intended, since the repository is described as
founder-only. Making it private is safe as long as the public shared assets (tokens and
base CSS) live in `COSYlanguages`, per section 4.1.

### 8.2 Orphan sweep results (Phase 1 input)

Each legacy repository was compared to its replacement set by content hash. "Truly
unique" means the file's content appears nowhere in the target repositories, under any
path or name.

**`COSYplatform-source` (1,747 files) vs `COSYplatform` + `COSYmanuals`:**

| Class | Files |
|---|---|
| Content exists elsewhere (moved or renamed) | 109 |
| **Content exists nowhere else** | **1,638** |

Unique content is concentrated in `drafts/` (686), `lessons/` (604), `curriculums/`
(147) and `reference/` (56).

The `lessons/` case is concrete. `COSYplatform-source/lessons/` holds 604 files;
`COSYplatform/lessons/` holds 62. **They share zero filenames** — the 604 are not
copies, they are a separate body of lesson material, mostly XML and JSON lessons for
English and Russian. They also carry a provenance trail: each XML header names its
origin, for example `source: .../COSYevents/main/sessions/debatable-relatable/4-day-work-week.html`.

**`COSYlanguagesss` (2,460 files) vs the other seven repositories:**

| Class | Files |
|---|---|
| Content exists elsewhere | 482 |
| **Content exists nowhere else** | **1,978** |

Unique content is concentrated in `vocabulary/` (690), `images/` (424), `project/`
(343) and `blog/` (148).

Two of these need a decision rather than a move:

- `vocabulary/` (690 files) overlaps `COSYdata/vocabulary/` (1,750 files), which
  suggests COSYdata already owns this data and the legacy copy is an earlier state.
- `project/docs/` (57 files) holds strategic documents, several of which were already
  rescued into `COSYmanuals/docs/from-cosylanguages/`. The rest are candidates for the
  same treatment.

The sweep is reproducible: index each repository by content hash, then compare the
legacy set against the union of its targets.

### 8.3 Classification pass: `project/docs/` (57 files)

The 57 documents in `COSYlanguagesss/project/docs/` were classified by reading each
one and checking whether its subject already has an owner.

| Class | Count | Action |
|---|---|---|
| Already rescued | 7 | None — byte-identical copies already exist in `COSYmanuals/docs/from-cosylanguages/` |
| Unique, valuable | 13 | Re-home to the owning repository |
| Audit reports | 32 | Archive under `COSYdata/reports/archive/`, or delete |
| Superseded | 2 | Delete |
| Mangled during rescue | 1 | Re-copy from the original |

**Unique, valuable (13) — re-home these:**

| Document | Owning repository |
|---|---|
| `THEMES.md` | COSYdata (it already holds `theme-domain-regional-audit`) |
| `SCHEMA.md` | COSYdata (word ID format) |
| `UNIFIED_VOCABULARY_TAXONOMY_AND_SCENE_MATCH_MATRIX.md` | COSYdata |
| `CONTENT_ARCHITECTURE.md` | COSYlanguages (current copy differs from the legacy one) |
| `LANGUAGES.md` | COSYlanguages (language registry) |
| `ROADMAP.md` | COSYlanguages (consolidated master roadmap) |
| `MULTI_REPO_MIGRATION_ARCHITECTURE.md` | COSYstudio (ecosystem architecture) |
| `DEEP_REPOSITORIES_COMPARISON_AND_MIGRATION_MANIFEST.md` | COSYstudio |
| `REPOSITORIES_DECOUPLING_AND_DATA_SYNC_GUIDELINES.md` | COSYstudio |
| `PRACTICE_UX_UI_DESIGN.md` | COSYpractice |
| `B1_PLUS_CURRICULUM_POLICY_AND_READINESS.md` | COSYmanuals |
| `COSYMANUALS_PRACTICE_BUTTONS_SPECIFICATION.md` | COSYmanuals (the rescued copy is mangled — see below) |
| `SCENE_MATCH_A0_A1_OPEN_WORLD_AND_IMAGE_PROMPTS.md` | COSYgames (owns `scene-match/`) |

**The rescue was partly lossy.** Of the files already copied to
`COSYmanuals/docs/from-cosylanguages/`, one is corrupt:
`COSYMANUALS_PRACTICE_BUTTONS_SPECIFICATION.md` was copied with all whitespace
stripped, so it is a single 2,194-byte line, and its URLs lost their slashes
(`https:cosylanguages.github.ioCOSYlanguagespractice`). The original 86-line version
in `COSYlanguagesss` is intact. The rescue needs a re-copy, and the other rescued files
should be diffed too, since this shows the copy step was not reliable.

### 8.4 The vocabulary risk (needs a decision)

`COSYlanguagesss/vocabulary/` is not redundant. `COSYdata` already ran a classification
of this content (`COSYdata/reports/LEGACY_CLASSIFICATION.md` and
`COSYLANGUAGES_ONLY_ENTRIES.csv`, 6,229 entries classified as `dictionary-word` or
`phrase/idiom`), which is strong evidence that COSYdata is the intended owner.

But the classification was not fully executed. Sampling 300 of the 6,229 classified
entries and searching `COSYdata/vocabulary/`:

| Result | Sampled | Estimated overall |
|---|---|---|
| Present in COSYdata | 89 | ~1,850 |
| **Not in COSYdata, but present in `COSYlanguagesss`** | **211** | **~4,380** |
| In neither | 0 | 0 |

So roughly **4,400 classified entries exist only in `COSYlanguagesss`**. Deleting that
repository without first importing them would lose vocabulary that someone already
decided should be in COSYdata.

This is the single most important item blocking Phase 1. The action is to complete the
import that `LEGACY_CLASSIFICATION.md` describes, then delete.

---

## Appendix A — Studio file inventory

| File | Lines | Bytes |
|---|---|---|
| `COSYevents/studio.html` | 599 | 32,582 |
| `COSYevents/shared/js/studio.js` | 2,891 | 124,795 |
| `COSYevents/styles/studio.css` | 1,471 | 30,523 |
| `COSYevents/scripts/test_studio.js` | 181 | 12,169 |
| `COSYplatform/lesson-studio.html` | 116 | 8,646 |
| `COSYplatform/shared/js/lesson-studio.js` | 1,584 | 85,684 |
| `COSYplatform/shared/js/studio-games.js` | 888 | 42,377 |
| `COSYplatform/shared/js/studio-media.js` | 151 | 7,451 |
| `COSYplatform/shared/css/lesson-studio.css` | 59 | 9,372 |
| `COSYplatform/studio-results.html` | 86 | 5,230 |
| `COSYplatform/shared/js/authoring.js` | 88 | 2,795 |
| `COSYplatform/supabase/migrations/*studio*.sql` | 1,466 | 8 migrations |
| `COSYplatform/supabase/tests/studio_*.test.sql` | 1,027 | 9 tests |
| `COSYmanuals/shared/studio/studio.html` | 97 | 4,524 |
| `COSYmanuals/shared/studio/manual-core.js` | 388 | 23,558 |
| `COSYmanuals/shared/studio/manual-studio.js` | 109 | 6,097 |
| `COSYmanuals/shared/studio/manual-studio.css` | 21 | 1,856 |
| `COSYmanuals/shared/studio/studio-core.js` | 189 | 6,541 |
| `COSYmanuals/tests/test_manual_studio.js` | 95 | 5,651 |
| `COSYmagazine/js/studio-core.js` | 189 | 6,541 |
| `COSYmagazine/js/issue-studio.js` | 176 | 7,366 |
| `COSYmagazine/tests/test_studio_core.mjs` | 101 | 5,197 |
| `COSYlanguages/print-studio/print-cards.html` | 381 | 15,828 |
| `COSYlanguages/print-studio/print-boardgame.html` | 439 | 20,927 |
| `COSYlanguages/print-studio/print-zine.html` | 379 | 16,075 |
| `COSYlanguages/print-studio/print-box.html` | 215 | 9,311 |
| `COSYlanguages/print-studio/monthly-zine-issue-1.html` | 287 | 11,339 |
| `COSYlanguagesss/print-studio/print-grammar.html` | 476 | 18,149 |
| `COSYstudio/schemas/ulo.schema.json` | 181 | 5,138 |
| `COSYstudio/schemas/blocks.schema.json` | 43 | 1,011 |
| `COSYstudio/src/types/ulo.ts` | 108 | 2,871 |
| `COSYstudio/src/utils/transformer.ts` | 79 | 1,947 |
| `COSYstudio/src/utils/validate.ts` | 38 | 1,144 |
| `COSYstudio/src/utils/cid.ts` | 18 | 550 |
| `COSYstudio/scripts/validate-ulo.js` | 27 | 875 |

## Appendix B — Adjacent builders (not named "studio")

- `COSYgames/scene-match/tools/hotspot-editor.html` (663 lines)
- `COSYworld/js/world/world_builder.js` (250 lines) with `tests/world_builder.test.mjs`
