# Orphan classification — Phase 1 input

Companion to `ECOSYSTEM_REORG_PLAN.md`. Section 8.2 of that plan established *how many*
files in the two legacy repositories exist nowhere else. This document answers the
question Phase 1 step 1 actually asks: **what each orphan is, and what to do with it.**

Method: content-hash each legacy repository, compare against the union of its targets,
then read the surviving files and group them by what they are. Read-only pass; nothing
was moved.

Targets compared against:

- `COSYplatform-source` → `COSYplatform` + `COSYmanuals`
- `COSYlanguagesss` → the other eleven repositories

---

## Summary

| Repository | Files | Unique | Class (a) move | Class (b) regenerate | Class (c) junk |
|---|---|---|---|---|---|
| `COSYplatform-source` | 1,746 | 1,637 | ~300 | ~1,300 | ~40 |
| `COSYlanguagesss` | 2,455 | 1,951 | ~500 | ~1,100 | ~350 |

"Move" means content that must be re-homed before deletion. "Regenerate" means the file
is produced from a source that still exists, or is superseded by a newer owner.
"Junk" means caches, drafts with no consumer, and abandoned experiments.

Two findings below are **live defects that need a fix regardless of this plan** and are
not merely reorganisation work. They are flagged in place.

---

## 1. `COSYplatform-source` (old `COSYplatform`)

1,637 unique files. Concentrated in `drafts/` (686), `lessons/` (604),
`curriculums/` (147), `reference/` (56).

### 1.1 `curriculums/` — 147 unique · **MOVE (urgent)**

**This is the most important finding in the pass.**

`COSYmanuals/curriculums/` contains 96 JSON files, of which **83 are stubs** of this
form:

```json
{
  "source": "https://cosylanguages.github.io/COSYplatform/curriculums/ru/general/A1.json",
  "note": "canonical data lives in COSYplatform"
}
```

That URL **returns 404** — `COSYplatform` has no `curriculums/` directory at all. The
stub asserts that `COSYplatform` is the canonical owner, but the only copy of the data
is in `COSYplatform-source`. So:

- The canonical curriculum data (5.8 MB, 144 JSON files, 14 languages) exists **only**
  in the repository scheduled for deletion.
- `COSYmanuals` currently serves 83 broken pointers to it.

Re-home the real files into `COSYmanuals/curriculums/`, replacing the stubs. Note that
97 of the unique files share a path with an existing `COSYmanuals` stub, so this is a
straight overwrite of stub → data, not a new tree.

The remaining 50 are unique to the source and have no stub: `en/` (45), `_archive/`
(25 of which 22 are archive-only), `_schema/` (1), and per-language `C1` files.

This item should be done **before** anything else in Phase 1, because it fixes a
currently-broken page as well as preserving the data.

### 1.2 `lessons/` — 604 unique · **SPLIT: 451 regenerate, 153 move**

Every one of the 450 `spoken-en/*.xml` files carries a provenance comment naming its
origin, e.g.:

```xml
<!-- source: https://raw.githubusercontent.com/cosylanguages/COSYevents/main/sessions/cinema-club/101-and-102-dalmatians.html -->
```

Checking all 450 against `COSYevents`: **445 origins still exist**. These files are
derived output from `scripts/convert-session-to-lesson.py`, and the converter is
present. They are class (b): regenerable, not unique content.

Three origins are gone (`template-quotes.xml`, `template-celebrate.xml`,
`template-mind.xml` — the session templates themselves, not real lessons), and two
reference `fixtures/` paths. These five are class (c).

The remaining **153 lessons are authored, not derived** — they carry no
`source:` comment. By directory:

| Directory | Files | What it is |
|---|---|---|
| `french-pronunciation/` | 59 | Authored pronunciation course |
| `general-english-a0/` | 32 | Authored A0 course |
| `english-pronunciation/` | 30 | Authored pronunciation course |
| `russian-pronunciation/` | 16 | Authored pronunciation course |
| `general-english-a1/` | 8 | Authored A1 lessons |
| `introductory/` | 2 | Onboarding lessons |
| `english-c1/`, `english-b2/` | 2 + 2 | Authored C1/B2 lessons |
| `spoken-en/` | 2 | The two `fixtures/` outliers |

These 153 are class (a) and need a home. `COSYmanuals` has no `lessons/` directory, so
either it gains one or the authored lessons move to `COSYplatform`.

### 1.3 `drafts/` — 686 unique · **REGENERATE (mostly)**

`drafts/README.md` states plainly: "English-language skeleton templates generated for
general language course modules... placeholder quiz distractors and English structural
text... must never be served or published directly."

`scripts/build_all_modules.py` (161 KB) is the generator, and it writes exactly to
`drafts/blueprints/{course}/`. The output is 685 JSON files across five courses
(general-{english,french,greek,italian,russian}-a1), all reproducible from the
`curriculums/{lang}/general/A1.json` input.

Class (b), with one caveat: **the generator is the asset, not its output.** If
`curriculums/` is rescued (§1.1) and `build_all_modules.py` is kept, the 685 files
regenerate. Do not migrate 686 placeholder files.

### 1.4 `reference/` — 56 unique · **MOVE**

53 grammar unit plans under `reference/grammar/en/lessons/` (CELTA-style: lead-in,
meaning check, target structure — e.g. `part-4-pronouns.json`), plus three READMEs.
No copy in either target. Class (a). `COSYmanuals` is the natural owner (it already
holds `data/grammar/reference/` for Russian).

### 1.5 `cefr/` — 17 unique · **MOVE**

The canonical CEFR master: `CEFR_Universal_Master.md`, `CHANGELOG.md`, `README.md`,
eight data files (`abilities`, `descriptors`, `functions`, `levels`, `meta`, `scales`,
`themes`, `toolkit`) and five schemas.

None of these eight data files match any file in `COSYdata` by content hash (0 of 8).
Three names do exist in `COSYdata` with different content — `levels.json` in
`taxonomy/`, `themes.json` in `schemas/`, `descriptors.json` under
`vocabulary/ru/b2/` — so a naive name-based merge would collide. `COSYdata` holds a
*draft* unified reference; this is the master. Class (a). `COSYdata` is the owner, and
the three name collisions need reconciling rather than overwriting.

### 1.6 `scripts/` — 35 unique · **SPLIT**

The build/convert/validate/publish toolchain: `build_all_modules.py`,
`convert-session-to-lesson.py`, `publish_to_supabase.js`, `validate-{cefr,curriculums,lessons}.js`,
`check-content-integrity.js`, and ~20 test scripts. `COSYplatform` has 15 scripts, none
of them these. Class (a) for the tooling — but only if the content it builds is kept.

`__pycache__/*.pyc` (2 files) are class (c).

### 1.7 `docs/` — 19 unique · **MOVE**

Architecture and specification documents: `CONTENT_MODEL.md`, `DATABASE.md`,
`MIGRATION_MAP.md`, `architecture.md`, `lesson-format-spec.md`,
`lesson-stage-taxonomy.md`, `schema-decision-brief.md`, `data-sources.md`, `i18n.md`,
`known-limitations.md`, `a0-a1-unit-crosswalk.md`, `lesson-spec-a0-a1-general.md`,
`roadmap-dedup-report.md`, `level-coverage-report.md`, `live-class-audit.md`,
`supabase-live-class.md`, `teacher-catalog-guide.md`, plus
`curriculum-enrichment-log.md` (175 KB) and `roadmap-lesson-resolution.json` (247 KB).

Class (a). `COSYmanuals` owns specs; `COSYstudio` owns ecosystem architecture. Split by
subject.

### 1.8 `shared/` — 18 unique · **SPLIT**

- `i18n/{el,en,fr,it,ru}.json` — these are **older** than `COSYplatform`'s (19.5 KB vs
  25 KB for `en.json`). Class (b): superseded.
- `js/cms-editor.js` — one of the six diverged copies already recorded in the plan
  (§3.3). Class (b): to be replaced by the single implementation in Phase 4.
- `js/{auth-guard,auth-sso,config,i18n,lang-switcher,lesson-resolver,progress,vocab-resolver}.js`
  — names match `COSYplatform/shared/js/`; content differs (older). Class (b).
- `templates/{curriculum,unit}-template.html`, `styles/style.css` — class (a)/(b) by
  whether `COSYmanuals/shared/templates/` already holds a newer copy (it holds
  `curriculum-template.html` and `unit-template.html`).

### 1.9 `supabase/` — 10 unique · **SUPERSEDED**

Nine numbered migrations (`0001`–`0009`) plus `schema.sql`. `COSYplatform` has 23
timestamped migrations that supersede this schema — the newer set declares itself
"Canonical Curriculum Owner: COSYplatform" and redefines the same tables
(`profiles`, `lessons`, `session_content`). Class (b): historical, keep only as a
migration-history record if wanted.

### 1.10 Remaining small groups

| Path | Unique | Class | Note |
|---|---|---|---|
| `templates/` | 6 | (a) | `communication/`, `grammar/` template HTML — no target copy |
| `roadmaps/` | 4 | (a) | `discussion-en-{a2,b1,b2,c1}.json` — COSYplatform has 55 roadmaps, not these |
| `activities/` | 3 | (a) | `games.json`, `print.json`, `tools.json` |
| `data/` | 2 | (a) | `conversion-map.json`, `platform-stats.json` |
| `teacher-guides/` | 2 | (a) | `index.html`, `lesson-plans/lesson-plan-template.md` |
| `reports/` | 3 | (b)/(c) | Two audit reports (point-in-time) + one `needs-review` note |

---

## 2. `COSYlanguagesss` (old `COSYlanguages`)

1,951 unique files (1,978 by the plan's count; the difference is files added to targets
since — chiefly the vocabulary import).

### 2.1 `vocabulary/` — 669 unique · **DONE**

Resolved. 5,532 entries imported into `COSYdata`, flagged `needs_review`
(plan §8.4, COSYdata PR #231). No further action; listed for completeness.

### 2.2 `project/` — 342 unique · **SPLIT: 13 move, 32 decide, ~290 junk**

Four subdirectories:

- **`project/docs/` (63 files)** — classified in plan §8.3: 13 unique/valuable to
  re-home, 32 audit reports to archive-or-delete, 2 superseded, 7 already rescued.
- **`project/scripts/` (167 files)** — 161 Python build scripts
  (`build_all_sessions.py`, `build_english_a1_grammar_manual.py`, and similar). These
  generated the *old* site's pages. Class (c) unless a specific script is still the
  only producer of content that survives; nothing in the sample is.
- **`project/tests/` (156 files)** — Playwright specs (`*.spec.ts`, `*.spec.js`) for the
  old site's pages. Class (c): they test routes that no longer exist.
- **`project/planning/` (9 files)** — notebooks and general planning. Class (c).

### 2.3 `images/` — 424 unique · **MOVE (selectively)**

Site imagery. Two groups:

- **Language-specific assets** (`images/{ba,br,de,es,pt,ru}/a1/*.png`, e.g. `to_be.png`)
  — vocabulary illustrations. `COSYdata` or the owning language page should take these.
- **Scene images** (`images/scenes/`, 13 files) — scene-match art: six named
  backgrounds stored without a file extension (`Cafe`, `City Street (outdoor hub)`,
  `Clothing Boutique`, `Living Room (Home Hub)`, `Park & Nature`,
  `Seasons Window View (bedroom window portal)`), one `market-sub-scene-...` file, one
  `apartment.png`, and five UUID-named `.jpg` files. `COSYgames` owns `scene-match/`
  and `data/scenes/` (24 JS descriptors) but holds **no scene images at all** — its
  only image is a logo. Class (a) → `COSYgames` (or `COSYworld`, which does hold
  `assets/images/scenes/`).
- Plus `cosyexamchallenge.png`, `cinema-club-*.png` and similar one-off art.

Class (a) for the scene and language sets; the rest needs eyeballing per file.

### 2.4 `blog/` — 148 unique · **MOVE (no owner today)**

A complete blog: 30+ published posts, translated variants
(`top-100-a0-a1-{breton,tatar,georgian,...}.html`), `posts.json`, `guides.json`,
`audio-scripts/`, a design system, and its own CSS.

Overlap with the other repositories is negligible: 3 of 151 files appear in
`COSYmagazine`, 0 in `COSYlanguages`, 0 in `COSYpractice`. So this is genuinely
homeless content. `COSYmagazine` is the closest owner (it is the publishing product),
but the blog is not currently part of it.

Class (a) — but **this needs a decision, not just a move**: either the blog is adopted
by `COSYmagazine`, or it is declared retired and dropped. It should not silently vanish
with the repository.

### 2.5 `languages/` — 61 unique · **MOVE (selectively)**

Per-language landing pages (`{lang}/index.html`, `pronunciation.html`,
`curriculum.html`, `vocabulary.html`, `grammar.html`) for 15 languages, plus
`coming-soon.html`.

`COSYlanguages/languages/` holds 31 files with a different structure (flat
`{lang}.html` plus a `ru/` directory). The legacy set is more complete for the
languages it covers. Class (a), but this is the gateway's own content and overlaps
`COSYlanguages` directly — reconcile rather than copy.

### 2.6 `docs/` — 36 unique · **MOVE**

Strategic and process documents: `ECOSYSTEM_ARCHITECTURE.md`,
`ECOSYSTEM_MIGRATION_BLUEPRINT.md`, `CONTENT_ARCHITECTURE.md`,
`cosy-languages-route-inventory.json`, `proposed-migration-map.json`,
`ecosystem-inventory.json`, `ecosystem-duplicate-candidates.json`,
`design-tokens.md`, `passport-schema.md`, `BLOG_*.md` (3),
`PAID_CONTENT_AUDIT.md`, `PREMIUM_COURSES_DIFF.md`, `PR_TRIAGE.md`, and others.

`COSYlanguages/docs/` holds a single file. Class (a) → `COSYstudio` for ecosystem
documents, `COSYmagazine` for the `BLOG_*` set.

### 2.7 `sounds/` — 37 unique · **DECIDE**

`sounds/draft{1..37}.mp3`. Named "draft", no index, no references found. Class (c) by
name; worth one listen before deletion.

### 2.8 `js/` — 32 unique · **SPLIT**

`js/core/` (`engine.js`, `linguistics.js`, `morphology.js`, `i18n.js`, `config.js`,
`auth-sso.js`), `js/pages/`, `js/data/`, `js/i18n/`, `js/utils/`. The linguistics and
morphology engines are the interesting part and may have no equivalent elsewhere.
Class (a) if `COSYtools` or `COSYpractice` has no equivalent; otherwise (b).

### 2.9 `print-studio/` — 7 unique · **MOVE**

`print-{cards,zine,box,boardgame,grammar}.html`, `monthly-zine-issue-1.html`,
`package.json`. These are the *drifted* copies the plan records in §3.3 (Print Studio
exists in both `COSYlanguages` and `COSYlanguagesss`, and the two differ). The plan
already earmarks Print Studio for `COSYstudio/studios/` in Phase 3. Class (a) — but
reconcile the drift first; `print-grammar.html` exists only here.

### 2.10 Remaining small groups

| Path | Unique | Class | Note |
|---|---|---|---|
| `data/` | 37 | (a) | `a0_a1_benchmark.json`, `a2_benchmark.json`, `courses/*.json`, per-language index files |
| `scripts/` | 46 | (b) | Build scripts for the old site; superseded |
| `tests/` | 23 | (c) | Tests for retired routes |
| `css/` | 15 | (b) | `base.css`, `layout.css` copies already recorded as duplicated |
| `templates/` | 10 | (a) | `blog-post-template.html`, `communication/`, `grammar/` |
| `courses/` | 7 | (a) | Course definitions |
| `apps/` | 6 | (c) | Unreferenced experiments |
| `hybrid/` | 5 | (b) | Superseded by current gateway |
| `shared/` | 5 | (b) | Older copies of shared assets |

---

## 3. Live defects found in this pass

These are not reorganisation work. They are broken today.

1. **83 broken curriculum pointers in `COSYmanuals`.** `COSYmanuals/curriculums/*/*/*.json`
   are stubs pointing at `https://cosylanguages.github.io/COSYplatform/curriculums/...`,
   which returns 404. The data exists only in `COSYplatform-source` (§1.1). Fixing this
   is the single highest-value action in Phase 1.

2. **The dead pinned imports** already recorded in plan §8.1 (19 files pinned to
   `f59a291e…`, 2 to `ba14a13d…`, 1 placeholder SHA). Confirmed still present.

---

## 4. Recommended order for Phase 1 step 2

1. **Rescue `curriculums/`** (§1.1) — fixes a live breakage; do it first.
2. **Rescue the small authored sets** — `reference/`, `cefr/`, `docs/`, `templates/`,
   `roadmaps/`, `activities/`, `teacher-guides/`, `data/` (§1.4–1.10).
3. **Rescue the 153 authored lessons** (§1.2) — needs a decision on the owning repo.
4. **Rescue scene and language images** (§2.3).
5. **Rescue the blog** (§2.4) — needs an owner decision.
6. **Rescue strategic docs** (§2.6) and the remaining small groups.
7. **Drop** the regenerable sets (`drafts/`, derived lessons, superseded i18n and
   Supabase schema) and the junk (`__pycache__`, old tests, planning notes).

Steps 3 and 5 are the two that need a decision before they can be executed. Everything
else is mechanical once the target repository is agreed.
