# COSYstudio Architecture Specification: Database-First Content Operating System (COS)

## Executive Summary & Database-First Philosophy

**COSYstudio is NOT a Learning Management System (LMS).**

It is the **Central Content Operating System (COS)** that powers the entire **COSYlanguages** ecosystem across all 11 organization repositories (`cosylanguages/*`). An LMS or platform service (`COSYplatform`) manages student logins, classroom hubs, teacher-student sessions, user accounts, and paid course subscriptions. In contrast, **COSYstudio** serves as the single source of truth (SSOT) for creating, localizing, versioning, orchestrating, and distributing thousands of **Reusable Learning Objects (RLOs)**.

### Core Architectural Paradigm: Database-First & Folderless Architecture
Traditional content management systems rely on hierarchical nested folders (`/es/b1/grammar/verbs/unit1/`). This creates content duplication, broken links, and rigid navigation silos.

**COSYstudio eliminates nested folders entirely.**

Instead, COSYstudio implements a **Database-First Content Architecture**:
1. **Everything is a Content Object (`ContentObject`)**: Every piece of content—a lesson, word, audio clip, quest dialogue, or quiz—is an atomic row in a flat, indexed content database with an immutable Content ID (`cid_*`).
2. **Metadata-Driven Organization**: Dynamic filtering, grouping, and relational querying replace folder navigation.
3. **Airtable / Notion Database UI**: Authors interact with content via customizable database views (Grid, Kanban Board, Gallery, Calendar, Node Graph Canvas) and instant multi-dimensional filters.

---

## 1. Educational Content Knowledge Graph & Non-Duplication Architecture

In COSYstudio, lessons, games, articles, and assessments **never duplicate information**. Every composite entity is a node in a **Directed Educational Knowledge Graph** that references canonical atomic objects by Content Identifiers (`cid_*`).

### 1.1 Knowledge Graph Node Hierarchy

The Knowledge Graph connects atomic learning objects into higher-level composite structures through typed relational edges:

```
                          [ LESSON CONTAINER ]
                                    |
              +---------------------+---------------------+
              |                                           |
     [ VOCABULARY NODE ]                         [ GRAMMAR RULE NODE ]
              |                                           |
      +-------+-------+                           +-------+-------+
      |               |                           |               |
[ ARTICLE NODE ] [ GAME BUNDLE ]             [ QUEST SCRIPT ] [ EXERCISE BLOCK ]
      |               |                           |               |
      +-------+-------+                           +-------+-------+
              |                                           |
       [ MEDIA ASSET ]                             [ ASSESSMENT QUIZ ]
              |                                           |
     [ FLASHCARD CARD ]                          [ PRONUNCIATION DRILL ]
```

#### Node Hierarchy Flow:
1. **Lesson (`cid_lesson_*`)**: Top-level composition container assembling learning sequences.
2. **Vocabulary (`cid_vocab_*`)**: Canonical headword term, IPA phonetics, and translation definitions.
3. **Grammar (`cid_gram_*`)**: Structural rule explanations, form-meaning-use formulas, and CCQ checks.
4. **Articles (`cid_article_*`)**: Cultural reads and magazine posts embedding vocabulary/grammar nodes.
5. **Games (`cid_gamepack_*`)**: Game prompt pools for `COSYgames` referencing target vocabulary/grammar.
6. **Quests (`cid_quest_*`)**: Open-world 3D NPC dialogue trees in `COSYworld` referencing dialogue/vocab.
7. **Exercises (`cid_exercise_*`)**: Interactive practice blocks (gap-fill, sorting, matching) referencing target terms.
8. **Media (`cid_media_*`)**: Audio snippets, native voice tracks, video manifests, 3D models.
9. **Assessments (`cid_quiz_*`)**: Graded evaluation items referencing exercises and rubrics.
10. **Flashcards (`cid_card_*`)**: Memory review cards referencing vocabulary/grammar CIDs.
11. **Pronunciation (`cid_drill_*`)**: Speech evaluation targets referencing target IPA and audio assets.

---

### 1.2 Knowledge Graph Relationship Types

Relational edges between Knowledge Graph nodes are strictly typed:

| Relationship Type | Direction | Description & Example |
| :--- | :--- | :--- |
| **`CONTAINS`** | Composite -> Child | Lesson contains Vocabulary: `cid_lesson_402 CONTAINS cid_vocab_9021` |
| **`EXPLAINS`** | Grammar -> Vocabulary | Grammar rule explains verb usage: `cid_gram_104 EXPLAINS cid_vocab_8921` |
| **`EXERCISES`** | Exercise -> Vocab/Grammar | Gap-fill tests vocabulary item: `cid_exercise_101 EXERCISES cid_vocab_9021` |
| **`PREREQUISITE_FOR`**| Node -> Node | A1 Vocabulary is prerequisite for B1 Lesson: `cid_vocab_101 PREREQUISITE_FOR cid_lesson_402` |
| **`TRANSFORMS_TO`** | Vocab -> Flashcard/Game | Vocabulary transforms into Flashcard: `cid_vocab_9021 TRANSFORMS_TO cid_card_9021` |
| **`REFERENCES_MEDIA`**| Node -> Media | Vocabulary references pronunciation audio: `cid_vocab_9021 REFERENCES_MEDIA cid_media_801` |
| **`EVALUATES`** | Assessment -> Node | Quiz evaluates Grammar rule mastery: `cid_quiz_301 EVALUATES cid_gram_104` |
| **`VARIANT_OF`** | Node -> Node | Dialect variant relation: `cid_vocab_9021_us VARIANT_OF cid_vocab_9021_uk` |

---

## 2. Automatic Update Propagation Engine

Because downstream applications (`COSYlanguages`, `COSYgames`, `COSYworld`, `COSYpractice`, `COSYmagazine`) reference canonical `cid_*` keys rather than embedding copies, **updating a single canonical object automatically updates every downstream consumer.**

### Example: Updating a Vocabulary Word ("El Cubierto")

Suppose an editor updates the canonical vocabulary node `cid_vocab_9021` ("El Cubierto"):
1. Updates definition text or attaches a higher-quality native audio recording (`cid_media_801`).
2. The COSYstudio core publishes a `content.updated` event to the NATS / Kafka Event Bus.
3. The event bus notifies Edge API nodes and triggers instant CDN cache invalidation.
4. **Instant Downstream Propagation**:
   * **Lessons** in `COSYlanguages` automatically show the new audio and definition.
   * **Micro-games** in `COSYgames` play the new audio snippet during matching games.
   * **Articles** in `COSYmagazine` update inline vocabulary popup cards.
   * **3D Quests** in `COSYworld` update NPC dialogue audio prompts.
   * **Worksheets & Print Booklets** in `COSYmanuals` re-render with corrected translation keys.
   * **Flashcards & Drills** in `COSYpractice` update speech evaluation targets.

```mermaid
sequenceDiagram
    autonumber
    actor Editor as Content Editor
    participant Studio as COSYstudio Core
    participant EventBus as NATS / Kafka Event Bus
    participant EdgeCDN as Global Edge CDN / Redis
    participant LangApp as COSYlanguages
    participant GameApp as COSYgames
    participant WorldApp as COSYworld
    participant MagApp as COSYmagazine

    Editor->>Studio: Update Canonical Vocab (cid_vocab_9021: New Audio + Definition)
    Studio->>Studio: Validate Schema & Bump Version (cid_vocab_9021@1.2.0)
    Studio->>EventBus: Broadcast Event: content.updated { cid: "cid_vocab_9021", version: "1.2.0" }

    EventBus-->>EdgeCDN: Invalidate Cache for cid_vocab_9021
    EdgeCDN->>EdgeCDN: Re-fetch & Populate Normalized JSON Payload

    EventBus-->>LangApp: Cache Invalidation Notice -> Refetches cid_vocab_9021
    EventBus-->>GameApp: Cache Invalidation Notice -> Refetches cid_vocab_9021
    EventBus-->>WorldApp: Cache Invalidation Notice -> Refetches cid_vocab_9021
    EventBus-->>MagApp: Cache Invalidation Notice -> Refetches cid_vocab_9021

    Note over LangApp, MagApp: Every Lesson, Game, Quest, and Article is automatically updated!
```

---

## 3. Versioning & Dependency Governance Strategy

To ensure seamless content updates without breaking active student sessions or consumer API contracts, COSYstudio enforces strict versioning rules.

### 3.1 Versioning Contracts: Immutable Versions vs Dynamic Aliasing

* **Immutable Version Identifiers (`cid@version`)**: Every version of a content object is immutable (e.g. `cid_vocab_9021@1.0.0`, `cid_vocab_9021@1.1.0`).
* **Dynamic Pointer Aliases (`@latest`, `@staging`, `@production`)**: Downstream applications query dynamic aliases (e.g. `cid_vocab_9021@production`).
* **SemVer Propagation Rules**:
  * **PATCH (`1.0.0` -> `1.0.1`)**: Typo fixes, definition refinement, minor audio re-recording. **Auto-propagates instantly** to `@production` alias.
  * **MINOR (`1.0.0` -> `1.1.0`)**: Additive non-breaking changes (new example sentence, additional regional IPA variant). **Auto-propagates instantly** to `@production` alias.
  * **MAJOR (`1.0.0` -> `2.0.0`)**: Structural breaking changes (part of speech change, complete headword restructuring). **Does NOT auto-propagate to `@production`**. Creates a new major version pointer, requiring author review and migration approval in downstream lessons.

### 3.2 Graph Dependency Impact Analysis & Rollback Safety

Before publishing a major update or deprecating an object, COSYstudio performs a **Graph Dependency Impact Analysis**:
* The right Inspector Drawer displays all downstream dependencies (`Reused In: 14 Lessons, 3 Games, 2 Quests`).
* **Emergency Rollback**: If an update contains an issue, the author clicks *"Rollback Alias"*, instantly pointing `cid_vocab_9021@production` back to `v1.1.0` across the global Edge CDN in <15ms.

---

## 4. High-Level Ecosystem Architecture Diagram

```
+--------------------------------------------------------------------------------------------------------+
|                                           COSYplatform                                                 |
|               (Central Auth SSO, User Accounts, Subscriptions, Billing, Global API Gateway)            |
+---------------------------------------------------+----------------------------------------------------+
                                                    |
                                                    v
+--------------------------------------------------------------------------------------------------------+
|                                           COSYstudio (COS)                                             |
|  +--------------------+   +-----------------------+   +-----------------------+   +------------------+  |
|  | Authoring & CMS    |   | Localization Manager  |   | Asset Pipeline (Media)|   | AI Assistant     |  |
|  +--------------------+   +-----------------------+   +-----------------------+   +------------------+  |
|  |  Content Graph SSOT: Vocabulary, Grammar, Exercises, Quests, Drills, Manuals, Articles, Events   |  |
|  +--------------------------------------------------------------------------------------------------+  |
|  | Exposed: GraphQL API / gRPC Edge / Global CDN / Event Stream (Kafka / NATS)                      |  |
+---------------------------------------------------+----------------------------------------------------+
                                                    |
                    +-------------------------------+-------------------------------+
                    |                               |                               |
          (Fetch Content Nodes)            (Fetch Media Assets)            (Event Stream Sub)
                    |                               |                               |
        +-----------v-----------+       +-----------v-----------+       +-----------v-----------+
        |     COSYlanguages     |       |     COSYpractice      |       |       COSYdata        |
        |  (Main Learning App)  |       |  (Interactive Drills) |       | (Analytics / Telemetry|
        | Owns: SRS State,      |       | Owns: Practice Runs,  |       | Owns: Telemetry Logs, |
        | Course Progress       |       | User Voice Recordings |       | Data Lake, ML Models  |
        +-----------------------+       +-----------------------+       +-----------------------+
                    |                               |                               |
    +---------------+---------------+---------------+---------------+---------------+---------------+
    |                               |                               |                               |
+---v-------------------+   +-------v---------------+   +-----------v-----------+   +---------------v-------+
|       COSYworld       |   |       COSYgames       |   |       COSYtools       |   |     COSYmagazine      |
| (3D Spatial Language) |   | (Micro-games Arcade)  |   |  (Dictionaries & Ext) |   | (Digital Magazine)    |
| Owns: 3D Session,     |   | Owns: Game Sessions,  |   | Owns: Tool Search     |   | Owns: Comments,       |
| Avatar Customization  |   | Leaderboards, Badges  |   | Cache, Extension Prefs|   | Reading Bookmarks     |
+-----------------------+   +-----------------------+   +-----------------------+   +-----------------------+
    |                               |                               |                               |
    +-------------------------------+---------------+---------------+-------------------------------+
                                                    |
                                    +---------------+---------------+
                                    |                               |
                        +-----------v-----------+       +-----------v-----------+
                        |      COSYevents       |       |      COSYmanuals      |
                        | (Webinars & Meetups)  |       | (Docs & Help Center)  |
                        | Owns: Event Tickets,  |       | Owns: Support Tickets,|
                        | Registrations, WebRTC |       | Vote Ratings          |
                        +-----------------------+       +-----------------------+
```

---

## 5. Notion-Style Visual Lesson Builder & JSON Block Engine

COSYstudio features a modern, drag-and-drop **Visual Lesson Builder** operating on 100% native JSON document trees (**Zero XML**).

* **24 Draggable Blocks**: Heading, Rich text, Image, Gallery, Video, Audio, Dialogue, Vocabulary Table, Grammar Table, Timeline, Matching, Sorting, Gap Fill, Flashcards, Pronunciation, Speaking, AI Discussion, Quiz, Poll, Reflection, Homework, Teacher Notes, Assessment, Custom Extension.
* **7 Lifecycle Contracts per Block**: Schema, Properties, Validation, Preview, Serialization, Rendering, Future Extensibility.
* **Real-Time Collaboration**: Yjs/CRDT WebSocket relay for multiplayer live co-authoring.
* **Undo/Redo Engine**: Non-blocking time-travel history stack (`Cmd+Z` / `Cmd+Shift+Z`).
* **Reusable Templates**: Save and instantiate block sequences as reusable templates (`cid_template_*`).

---

## 6. Unified Content Object Model & Metadata Schema

Every entity in COSYstudio inherits from the base `ContentObject` schema.

```typescript
export type CEFRLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LanguageCode = 'en' | 'fr' | 'it' | 'ru' | 'el' | 'es' | 'de' | 'pt' | 'hy' | 'ka' | 'ba' | 'br' | 'cv' | 'tt';

export interface ContentObjectMetadata {
  cid: string; // "cid_vocab_01H8X..."
  objectType: 'LESSON' | 'DIALOGUE' | 'VOCABULARY' | 'GRAMMAR' | 'EXERCISE' | 'QUIZ' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'PROMPT' | 'WORKSHEET' | 'ARTICLE' | 'QUEST' | 'GAME';
  targetLanguage: LanguageCode;
  cefrLevel: CEFRLevel;
  theme: string;
  subTheme?: string;
  grammarRuleCids: string[];
  skills: ('READING' | 'WRITING' | 'LISTENING' | 'SPEAKING' | 'PRONUNCIATION' | 'GRAMMAR' | 'VOCABULARY')[];
  ageGroups: ('CHILDREN' | 'KIDS' | 'TEENS' | 'ADULTS' | 'BUSINESS')[];
  targetAudiences: ('GENERAL' | 'SPOKEN' | 'EXAM' | 'PROFESSIONAL' | 'TRAVEL' | 'RELOCATION')[];
  estimatedDurationSeconds: number;
  learningObjectives: string[];
  status: 'DRAFT' | 'REVIEW' | 'STAGING' | 'PUBLISHED' | 'ARCHIVED' | 'DEPRECATED';
  tags: string[];
  difficultyScore: number;
  dependencies: {
    prerequisiteCids: string[];
    childCids: string[];
    relatedCids: string[];
    variantCids: string[];
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}
```

---

## 7. Entity Relationship Diagrams (ERDs)

```mermaid
erDiagram
    CONTENT_OBJECTS ||--o{ CONTENT_DEPENDENCIES : "has prerequisites/children"
    CONTENT_OBJECTS ||--o{ OBJECT_LOCALIZATIONS : "has translations"
    CONTENT_OBJECTS ||--o{ OBJECT_TAXONOMY_TAGS : "tagged with"
    CONTENT_OBJECTS ||--o{ OBJECT_MEDIA_BINDINGS : "attaches media"
    CONTENT_OBJECTS ||--o{ OBJECT_REUSED_IN : "consumed by apps"

    CONTENT_OBJECTS {
        string cid PK "Primary Key (cid_*)"
        string object_type "LESSON|VOCABULARY|GRAMMAR|EXERCISE|QUEST|etc."
        string target_language "ISO 639-1 code"
        string cefr_level "A0|A1|A2|B1|B2|C1|C2"
        string theme "Primary Taxonomy Key"
        string sub_theme "Optional Sub-theme Key"
        int estimated_duration_sec "Seconds"
        string status "DRAFT|PUBLISHED|DEPRECATED"
        int difficulty_score "1 to 100"
        jsonb payload "Type-specific JSON contract"
        datetime created_at "Timestamp"
        datetime updated_at "Timestamp"
        int version "SemVer counter"
    }

    CONTENT_DEPENDENCIES {
        string parent_cid FK "Parent Object ID"
        string child_cid FK "Child/Required Object ID"
        string dependency_type "PREREQUISITE|CHILD_COMPOSITION|RELATED|VARIANT"
        int sequence_order "Position index"
    }

    OBJECT_LOCALIZATIONS {
        string cid FK "Content Object ID"
        string locale PK "ISO Language Code (e.g. fr, es, ru)"
        string loc_key "Localization Key"
        string translated_text "Localized text string"
        string verification_status "NEEDS_REVIEW|VERIFIED"
    }

    OBJECT_TAXONOMY_TAGS {
        string cid FK "Content Object ID"
        string tag_id PK "Tag Key (e.g. #dining)"
        string category "TOPIC|GRAMMAR_CONCEPT|EXAM_FORMAT"
    }

    OBJECT_MEDIA_BINDINGS {
        string cid FK "Content Object ID"
        string media_cid FK "Image/Audio/Video Object ID"
        string binding_role "PRONUNCIATION_AUDIO|BACKGROUND_IMAGE|3D_MODEL"
    }

    OBJECT_REUSED_IN {
        string cid FK "Content Object ID"
        string consumer_app PK "COSYlanguages|COSYworld|COSYgames|COSYpractice"
        string usage_context "LESSON_CARD|NPC_DIALOGUE|MICRO_GAME_PROMPT"
    }
```

---

## 8. Data Ownership Matrix (11 Ecosystem Repositories)

| Data Entity / Domain | studio | platform | languages | world | games | tools | data | magazine | events | manuals | practice |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Canonical Vocabulary & Dictionary** | **OWNER** | Forbidden | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only |
| **Grammar Rules & Explanations** | **OWNER** | Forbidden | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only |
| **Media Assets (Audio, Video, 3D)** | **OWNER** | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only |
| **Localization Master Keys & Translations** | **OWNER** | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only |
| **Quest Scenarios & Dialogue Trees** | **OWNER** | Forbidden | Read-Only | Read-Only | Forbidden | Forbidden | Read-Only | Read-Only | Forbidden | Forbidden | Read-Only |
| **Drill Masters & Exercise Rubrics** | **OWNER** | Forbidden | Read-Only | Read-Only | Read-Only | Forbidden | Read-Only | Forbidden | Forbidden | Forbidden | Read-Only |
| **Documentation Articles (Manuals)** | **OWNER** | Read-Only | Read-Only | Forbidden | Forbidden | Read-Only | Read-Only | Forbidden | Forbidden | Read-Only | Forbidden |
| **User Identity, Auth & Billing** | Forbidden | **OWNER** | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only |
| **User Progress & SRS Card State** | Forbidden | Forbidden | **OWNER** | Read-Only | Read-Only | Forbidden | Read-Only | Forbidden | Forbidden | Forbidden | Read-Only |
| **3D World Session & Avatar Cosmetics**| Forbidden | Forbidden | Forbidden | **OWNER** | Forbidden | Forbidden | Read-Only | Forbidden | Forbidden | Forbidden | Forbidden |
| **Game Match Sessions & High Scores** | Forbidden | Forbidden | Read-Only | Forbidden | **OWNER** | Forbidden | Read-Only | Forbidden | Forbidden | Forbidden | Forbidden |
| **Tool Search Cache & Local Prefs** | Forbidden | Forbidden | Forbidden | Forbidden | Forbidden | **OWNER** | Read-Only | Forbidden | Forbidden | Forbidden | Forbidden |
| **Telemetry, Analytics & AI Models** | Forbidden | Read-Only | Read-Only | Read-Only | Read-Only | Read-Only | **OWNER** | Read-Only | Read-Only | Read-Only | Read-Only |
| **Magazine Comments & Bookmarks** | Forbidden | Forbidden | Forbidden | Forbidden | Forbidden | Forbidden | Read-Only | **OWNER** | Forbidden | Forbidden | Forbidden |
| **Event Registrations & Tickets** | Forbidden | Read-Only | Forbidden | Forbidden | Forbidden | Forbidden | Read-Only | Forbidden | **OWNER** | Forbidden | Forbidden |
| **Help Tickets & User Vote Ratings** | Forbidden | Read-Only | Forbidden | Forbidden | Forbidden | Forbidden | Read-Only | Forbidden | Forbidden | **OWNER** | Forbidden |
| **Practice Audio Recordings & Runs**| Forbidden | Forbidden | Read-Only | Forbidden | Forbidden | Forbidden | Read-Only | Forbidden | Forbidden | Forbidden | **OWNER** |

---

## 9. Verified Repository Boundary Analysis (11 Repositories)

Below is the definitive boundary analysis for all 11 repositories in the `cosylanguages/` organization answering all 5 core questions per repository.

### 9.1 COSYstudio (`cosylanguages/COSYstudio`)
* **Responsibility**: Central Content Operating System (COS). Single source of truth for authoring, versioning, localization, asset transcoding, and edge RLO distribution.
* **Data Owned**: Canonical Content Objects (`cid_*`), Media Manifests, Localization Master Keys, Taxonomy Trees, Version History Logs.
* **Data It Must NEVER Own**: Student Enrollments, Paid Classroom Sessions, Private Student Data, SRS States, Event Registrations.
* **Exposed APIs**: `Content Query API` (GraphQL/gRPC/REST), `Content Authoring API`, `Search & Taxonomy Index API`, `Content Event Stream` (Kafka/NATS).
* **Consumed APIs from COSYstudio**: N/A (Core Provider).

### 9.2 COSYdata (`cosylanguages/COSYdata`)
* **Responsibility**: Canonical machine-readable data repository and vocabulary hub serving dictionary datasets (`vocabulary/<lang>/`) and taxonomy schemas (`schemas/themes.json`) across 14 ISO languages.
* **Data Owned**: Standardized Vocabulary JSON Entries (`A0`–`C2`), IPA Transcriptions, Dialect Variants, `schemas/themes.json`, Index Artifacts (`index.json`, `flat-index.json`).
* **Data It Must NEVER Own**: Student SRS Intervals, User Credentials, Quiz Performance Scores.
* **Exposed APIs**: Static CDN REST Endpoints (`vocabulary/<lang>/<level>/<theme>.json`), `vocab-resolver.js`, `cosy-word-popup.js`.
* **Consumed APIs from COSYstudio**: Ingests published vocabulary RLOs, IPA definitions, and taxonomy trees from `content.published` event stream.

### 9.3 COSYplatform (`cosylanguages/COSYplatform`)
* **Responsibility**: Web application for students, teachers, and founder providing authentication, student hub, paid course execution, and online virtual classroom.
* **Data Owned**: User Accounts, Auth Credentials, OAuth Tokens, Classroom State, Paid Course Enrollments, Private Student Progress (Supabase).
* **Data It Must NEVER Own**: Public Vocabulary Master Data, Dictionaries, Offline Booklet Reference Materials.
* **Exposed APIs**: `Classroom Service API`, `Student Progress API`.
* **Consumed APIs from COSYstudio**: Fetches structured lesson block templates and RLO schemas by `cid` for live classroom rendering.

### 9.4 COSYlanguages (`cosylanguages/COSYlanguages`)
* **Responsibility**: Free public front door, landing portal, language hubs, course catalogue, placement quiz, price calculator, and hybrid community pages.
* **Owned Data**: Portal Page UI State, Interface Translations (`data/ui/<lang>.json`), `config.js` Registry, Placement Quiz Logic.
* **Data It Must NEVER Own**: Master Vocabulary Datasets, User Auth Credentials, Private Classrooms.
* **Exposed APIs**: Static Web Portal Pages & Client Navigation Engine.
* **Consumed APIs from COSYstudio**: Fetches course catalog metadata, localized UI descriptors, and placement quiz RLOs.

### 9.5 COSYpractice (`cosylanguages/COSYpractice`)
* **Responsibility**: Free interactive practice exercise engine for vocabulary, grammar, and speaking (`en`, `fr`, `it`, `ru`, `el`) with SRS reviews and daily challenges.
* **Owned Data**: Browser LocalStorage SRS Memory State, Practice Session Scores, Weak Spot Indicators, Progress Dashboard Metrics.
* **Data It Must NEVER Own**: Master Vocabulary JSON Files, Master Grammar Explanations, CCQ Rule Documents.
* **Exposed APIs**: Client-side practice engine (`_engine/`) and progress dashboard (`progress-dashboard.html`).
* **Consumed APIs from COSYstudio**: Dynamically fetches vocabulary RLOs, grammar exercise blocks, and CCQ prompts by `cid`.

### 9.6 COSYtools (`cosylanguages/COSYtools`)
* **Responsibility**: Offline-first, client-side language reference suite (verb conjugators, noun gender/case declension, case matrices) across 14 languages.
* **Owned Data**: Tool Datasets (`tools/<lang>/<tool>/data/`), Sharded Dictionaries, `catalog.json` Inventory.
* **Data It Must NEVER Own**: Student Course Enrollments, Classroom Telemetry, User Auth Tokens.
* **Exposed APIs**: Deep-Linking Query Interfaces (`?verb=<lemma>`, `?noun=<word>`, `?q=<keyword>`).
* **Consumed APIs from COSYstudio**: Reads canonical headwords, conjugation tables, and grammatical rules.

### 9.7 COSYgames (`cosylanguages/COSYgames`)
* **Responsibility**: Suite of 20 interactive standalone language games for communicative fluency and vocabulary practice.
* **Owned Data**: Game Match State, Active Session Scores, Local High Score History.
* **Data It Must NEVER Own**: Master Dictionaries, User Accounts, Pedagogical Progress Tracking.
* **Exposed APIs**: Client-side game runners (HTML5 / ES6 Modules).
* **Consumed APIs from COSYstudio**: Fetches mini-game content bundles (`cid_gamepack_*`).

### 9.8 COSYevents (`cosylanguages/COSYevents`)
* **Responsibility**: Public calendar directory and session material repository (speaking club decks, cinema guides, masterclasses).
* **Owned Data**: Event Definitions (`events/<slug>/event.json`), Session JSONs (`events/<slug>/sessions/<slug>.json`), Calendar Index (`public-events.json`).
* **Data It Must NEVER Own**: Private Classroom Sessions, User Auth Secrets, Paid Course Enrollments.
* **Exposed APIs**: Static Calendar Directory (`index.html`, `public-events.json`).
* **Consumed APIs from COSYstudio**: Fetches session prompt decks (`cid_eventpack_*`), event descriptions, and media assets.

### 9.9 COSYmanuals (`cosylanguages/COSYmanuals`)
* **Responsibility**: Public catalog and gated learning portal holding manuals, teacher guides, student workbooks, and print booklets across 13 ISO languages + Chuvash.
* **Owned Data**: Public Manual Catalog Metadata (`catalog/*.json`), Curriculum Maps (`curriculums/<iso>/<track>/<LEVEL>.json`), Gated Body Text (Supabase), Printable Booklet Layouts.
* **Data It Must NEVER Own**: Master Vocabulary Datasets, Live Classroom Session State.
* **Exposed APIs**: Public Catalog Manifest (`catalog/manifest.json`), Manual Viewers.
* **Consumed APIs from COSYstudio**: Fetches documentation nodes (`cid_manual_*`), grammar rule explanations, and vocabulary sets.

### 9.10 COSYmagazine (`cosylanguages/COSYmagazine`)
* **Responsibility**: Short speaking-first digital publication (articles, sentence frames, podcasts) with flipbook and stage presentation modes (`?stage=1`, `?script=1`).
* **Owned Data**: Editorial Article JSON Posts (`posts/*.json`), Podcast Feed (`podcast.xml`), Generated Static HTML Pages, Newsstand Index (`posts.json`).
* **Data It Must NEVER Own**: Embedded Master Dictionary Definitions.
* **Exposed APIs**: Newsstand Interface (`index.html`), RSS Podcast Feed (`podcast.xml`).
* **Consumed APIs from COSYstudio**: Fetches article content nodes (`cid_article_*`), inline vocabulary popups, and podcast audio assets.

### 9.11 COSYworld (`cosylanguages/COSYworld`)
* **Responsibility**: Standalone open-world RPG for direct language immersion in COSY Town across 14 target languages (character selection: James York, Ella Bronx, Anna).
* **Owned Data**: COSY Town Hotspots, RPG Instance State, Player Citizen Level, XP, COSY Passport Progress Saves (LocalStorage / JSON).
* **Data It Must NEVER Own**: Master Dictionary & Grammar Rules.
* **Exposed APIs**: Standalone RPG Web App & COSY Passport Export/Import Engine.
* **Consumed APIs from COSYstudio**: Fetches NPC dialogue trees (`cid_dialogue_*`), quest script nodes (`cid_quest_*`), and localized object names.

---

## 10. Shared Packages (`@cosy/*`) & Governance

To guarantee type safety, consistent content referencing, and schema validation across all 11 repositories, shared packages are maintained in the `@cosy/` registry.

```
@cosy/
├── schema-content/       # Canonical TypeScript & JSON Schemas for Content Objects
├── schema-events/        # Event payload schemas for NATS / Kafka event bus
├── sdk-client/           # Multi-platform Client SDK (TypeScript / Rust / C# Unity)
├── ui-tokens/            # Shared design system tokens, typography, iconography
└── core-utils/           # CID generators, CEFR helpers, language code parsers
```

### Governance Rules
1. **Zero Runtime Side-Effects**: Shared packages contain **only types, schemas, validation utilities, and client contracts**.
2. **Semantic Versioning (SemVer)**: Major for breaking schema changes, Minor for additive changes, Patch for bug fixes.
3. **Automated Schema Codegen**: Protobuf / JSON Schemas generate TypeScript, Rust, and C# code.

---

## 11. Migration Strategy

Migrating existing applications across all 11 repositories to the strict COSYstudio COS architecture follows a 5-phase zero-downtime plan.

1. **Phase 1: Foundation Setup & Package Publishing (`@cosy/*`)**: Deploy edge CDN, NATS event bus, and shared packages.
2. **Phase 2: Extraction & Deduplication into COSYstudio SSOT**: Extract raw content tables from consumer repos (`COSYdata`, `COSYevents`, `COSYmanuals`, `COSYmagazine`) and deduplicate into canonical `ContentNode` graphs with `cid_*`.
3. **Phase 3: Dual-Read & Translation Shim Deployment**: Enable consumer services to fetch content via `cid` while maintaining legacy fallback.
4. **Phase 4: Full Read-Switch & Consumer DB Content Purge**: Route 100% of content reads to COSYstudio Edge APIs and purge raw content tables from consumer DBs.
5. **Phase 5: Automated CI/CD Guardrails**: Enforce linter rules preventing raw content/translation tables from being introduced into consumer apps.

---

## Conclusion

By combining a Notion-style Visual Lesson Builder, 24 extensible block primitives, 100% JSON internal contracts (zero XML), real-time collaboration (Yjs CRDTs), an Educational Content Knowledge Graph, and a database-first folderless Content Operating System:
* **Zero XML & 100% JSON Engine**: Fast, clean, type-safe block serialization.
* **Knowledge Graph Non-Duplication**: Content exists once in `COSYstudio` and is referenced via `cid`.
* **Automatic Update Propagation**: Updating one canonical object automatically updates every downstream lesson, game, article, and quest in real-time.
* **Domain Ownership**: Clean isolation across all 11 `cosylanguages/` repositories.
