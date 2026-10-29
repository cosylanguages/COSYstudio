# COSYstudio - Central Content Operating System (COS)

Welcome to the architectural specification for **COSYstudio**, the central Content Operating System (COS) for the entire **COSYlanguages** ecosystem.

## Vision & Purpose

**COSYstudio is NOT an LMS.**

An LMS or platform service (`COSYplatform`) manages student logins, classroom hubs, teacher-student sessions, user accounts, event tickets, and subscriptions. **COSYstudio** is the single source of truth (SSOT) for all content creation, localization, versioning, taxonomy, media asset pipelines, and edge content distribution across all 11 repositories in the `cosylanguages/` organization.

Designed as a modern, high-velocity database-first creator application inspired by **Notion**, **Airtable**, **Linear**, **Figma**, **ProgressMe**, and **Edvibe**, COSYstudio powers thousands of Reusable Learning Objects (RLOs) without nested folder silos or content duplication.

Everything in COSYstudio is an atomic **Content Object (`ContentObject`)** identified by an immutable Content Identifier (`cid`). Dynamic database filtering and Airtable-like views replace traditional folder trees.

## Visual Lesson Builder & Block-Based Engine

COSYstudio includes a Notion-style drag-and-drop Visual Lesson Builder that operates on 100% native JSON documents (**Zero XML**):

- **24 Draggable Blocks**: Heading, Rich text, Image, Gallery, Video, Audio, Dialogue, Vocabulary Table, Grammar Table, Timeline, Matching, Sorting, Gap Fill, Flashcards, Pronunciation, Speaking, AI Discussion, Quiz, Poll, Reflection, Homework, Teacher Notes, Assessment, Custom Extension.
- **7 Lifecycle Contracts per Block**: Schema, Properties, Validation, Preview, Serialization, Rendering, Future Extensibility.
- **Multiplayer Collaboration**: Yjs/CRDT WebSocket relay for real-time live co-authoring and cursor presence.
- **Undo/Redo History Engine**: Non-blocking time-travel history stack (`Cmd+Z` / `Cmd+Shift+Z`).
- **Reusable Templates**: Save and instantiate block sequences as reusable templates (`cid_template_*`).

## Complete Ecosystem Repositories & Boundaries (11 Repositories)

| Repository | Domain Responsibility | Data Owned | Consumes From COSYstudio |
| :--- | :--- | :--- | :--- |
| **COSYstudio** | Central Content Operating System (CMS, Localization, Asset Pipelines) | Content Objects, Media Manifests, Localization Keys, Taxonomy | Core Provider |
| **COSYdata** | Canonical Machine-Readable Data & Vocabulary Hub | Vocabulary JSON datasets, IPA transcriptions, `themes.json` taxonomy | `content.published` event stream, updated RLO schemas |
| **COSYplatform** | Virtual Classroom, Student/Teacher Hub & Authentication | User Auth Credentials, Classroom session state, Paid course rights | Structured lesson templates & RLOs by `cid` |
| **COSYlanguages** | Main Free Public Front Door & Language Hub Portal | Portal UI state, `config.js` registry, Placement quiz state | Course catalog metadata & localized UI descriptors |
| **COSYpractice** | Free Interactive Practice Engine (SRS, Drills, Wheel) | Browser local storage SRS state, Practice scores, Session metrics | Vocabulary RLOs, Grammar exercise blocks, CCQ prompts |
| **COSYtools** | Client-Side Offline Reference Engine (Conjugators, Declensions) | Tool-specific datasets (`tools/<lang>/`), Sharded dictionaries | Headword definitions, conjugation tables & grammatical rules |
| **COSYgames** | Suite of 20 Interactive Standalone Language Games | Game match state, Session scores, Local high score history | Mini-game content bundles (`cid_gamepack_*`) |
| **COSYevents** | Public Calendar Directory & Session Material Repository | Event definitions (`event.json`), Session JSONs (`public-events.json`) | Session prompt decks (`cid_eventpack_*`), Media assets |
| **COSYmanuals** | Public Catalog & Gated Learning Manuals Portal | Manual metadata (`catalog/*.json`), Curriculum maps, Gated text | Manual documentation nodes (`cid_manual_*`), Tooltips |
| **COSYmagazine** | Digital Publication, Flipbook & Podcast Station | Article JSON posts (`posts/*.json`), Podcast XML, Generated HTML | Article content nodes (`cid_article_*`), Inline Vocab |
| **COSYworld** | Standalone Open-World RPG in COSY Town (14 Languages) | Town map hotspots, Player RPG state, COSY Passport saves | NPC Dialogue trees (`cid_dialogue_*`), Quest scripts |

## 12 Core Application Modules

COSYstudio consists of 12 modern, integrated modules engineered for high-scale RLO composition:

1. **Dashboard**: Ecosystem content health, velocity metrics, and real-time activity stream.
2. **Content Library**: Central searchable database repository for all RLOs with Linear-style filtering and "Reused In" impact graphs.
3. **Curriculum**: Scope & sequence tree editor mapping RLOs into learning paths and CEFR tracks.
4. **Lesson Builder**: Notion-style slash command block editor and Figma-style canvas visualizer for interactive lesson flows.
5. **Vocabulary Database**: Master lexicon manager with IPA phonetics, multi-target translation matrices, and audio attachments.
6. **Grammar Database**: Canonical grammar rules with form-meaning-use breakdown blocks and pattern visualizers.
7. **Media Library**: Asset pipeline with automated audio-text alignment, video transcoding, and 3D asset ingestion.
8. **Assessment Builder**: Dynamic test generator, question variant transformer, and IRT difficulty calibrator.
9. **Publishing**: Multi-environment deployment pipeline (`DRAFT` -> `STAGING` -> `PRODUCTION`) with instant CDN cache invalidation.
10. **Analytics**: RLO Performance Index tracking exercise failure rates, drop-offs, and pedagogical effectiveness.
11. **AI Assistant**: Auto-generator for contextual sentences, CEFR estimator, and automated translator.
12. **Settings**: Role-based access control (RBAC), localization locales, webhooks, and schema contracts.

## Architectural Documentation

For complete detailed specifications, diagrams, matrices, shared schemas, and migration strategies, please refer to:

- 📖 **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Full Principal Architect specification document.
  - **Section 1**: Visual Lesson Builder & 100% JSON Block Engine (Zero XML)
  - **Section 2**: 24 Lesson Builder Blocks & 7 Core Lifecycle Contracts
  - **Section 3**: Real-Time Collaboration (Yjs CRDTs) & Undo/Redo Engine
  - **Section 4**: Reusable Template Engine (`cid_template_*`)
  - **Section 5**: Unified Content Object Model & Standardized Metadata
  - **Section 6**: Entity Relationship Diagrams (ERDs for Content Objects & Relations)
  - **Section 7**: Verified Repository Boundary Analysis (11 Repositories)
  - **Section 8**: 5-Phase Zero-Downtime Migration Strategy

## Guiding Architectural Axioms

1. **Zero XML & 100% JSON Engine**: Fast, clean, type-safe block serialization.
2. **Folderless Database-First**: Dynamic metadata filtering replaces nested folder hierarchies.
3. **Content Centralization**: No downstream application creates or stores raw content tables.
4. **Decoupled Identity (`cid`)**: Downstream applications store only immutable content IDs (`cid_*`).
5. **Event-Driven Propagation**: Content updates publish via Kafka/NATS event bus to invalidate CDN/Redis caches.
