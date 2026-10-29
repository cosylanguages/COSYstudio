# COSYstudio - Central Content Operating System (COS)

Welcome to the architectural specification for **COSYstudio**, the central Content Operating System (COS) for the entire **COSYlanguages** ecosystem.

## Vision & Purpose

**COSYstudio is NOT an LMS.**

An LMS or platform service (`COSYplatform`) manages student logins, classroom hubs, teacher-student sessions, user accounts, event tickets, and subscriptions. **COSYstudio** is the single source of truth (SSOT) for all content creation, localization, versioning, taxonomy, media asset pipelines, and edge content distribution across all 11 repositories in the `cosylanguages/` organization.

Designed as a modern, high-velocity database-first creator application inspired by **Notion**, **Airtable**, **Linear**, **Figma**, **ProgressMe**, and **Edvibe**, COSYstudio powers thousands of Reusable Learning Objects (RLOs) without nested folder silos or content duplication.

### The Universal Learning Object (ULO) Paradigm Shift

COSYstudio does **NOT "contain" lessons or siloed folder trees**. Instead, every entity is an instance of the **Universal Learning Object (ULO)** underlying primitive:

```
                         UNIVERSAL LEARNING OBJECT (ULO)
                                        │
    ├── Lesson                 ├── Grammar Topic          ├── Game Level
    ├── Exercise               ├── Article                ├── Worksheet
    ├── Dialogue               ├── Conversation Club      ├── Assessment
    ├── Vocabulary Set         ├── Quest                  ├── Audio / Video / Image
```

Each ULO carries **6 Fundamental Dimensions**:
1. **Metadata**: Language, CEFR, Theme, Skills, Age, Target Audience, Duration, Objectives, Status, Tags, Difficulty.
2. **Relationships**: Directed Graph Edges (`CONTAINS`, `DEPENDS_ON`, `EXPLAINS`, `EXERCISES`, `TRANSFORMS_TO`, `REFERENCES_MEDIA`, `EVALUATES`).
3. **Version History**: Immutable SemVer snapshots (`v1.0.0`) & dynamic pointer aliases (`@production`).
4. **AI Actions**: 21 native contextual generation and transformation actions.
5. **Localization**: Multi-target translation matrix across 14 ISO languages.
6. **Publication Targets & Transformation**: Dynamic target transformation engine compiling ULOs into target-specific schemas (`COSYlanguages`, `COSYworld`, `COSYgames`, `COSYmagazine`, PDF Worksheet, Classroom Presentation, Mobile App, API) without content duplication.

## Integrated AI Assistant (21 Native Actions)

COSYstudio features a native **Integrated AI Assistant** with real-time context awareness across all 11 ecosystem repositories:

- **21 Native AI Actions**: Generate lesson, Improve lesson, Simplify, Increase CEFR, Translate, Generate vocabulary, Generate examples, Generate IPA, Generate pronunciation, Generate quiz, Generate discussion, Generate homework, Generate article, Generate worksheet, Generate listening, Generate TTS, Generate images, Generate dialogue, Generate roleplay, Generate cultural notes, Generate metadata.
- **Cross-Repository Context Engine**: Queries `COSYdata` lexicon, `COSYmanuals` curriculums, `COSYpractice` telemetry, `COSYworld` RPG quests, `COSYmagazine` articles, and `COSYtools` conjugators.
- **Human-in-the-Loop Review**: Authors review, edit, and approve candidate RLOs before edge CDN publishing and auto-linking.

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
| **COSYstudio** | Central Content Operating System (CMS, Localization, Asset Pipelines) | Universal Learning Objects, Media Manifests, Localization Keys, Taxonomy | Core Provider |
| **COSYdata** | Canonical Machine-Readable Data & Vocabulary Hub | Vocabulary JSON datasets, IPA transcriptions, `themes.json` taxonomy | `content.published` event stream, updated ULO schemas |
| **COSYplatform** | Virtual Classroom, Student/Teacher Hub & Authentication | User Auth Credentials, Classroom session state, Paid course rights | Structured lesson templates & ULOs by `cid` |
| **COSYlanguages** | Main Free Public Front Door & Language Hub Portal | Portal UI state, `config.js` registry, Placement quiz state | Course catalog metadata & localized UI descriptors |
| **COSYpractice** | Free Interactive Practice Engine (SRS, Drills, Wheel) | Browser local storage SRS state, Practice scores, Session metrics | Vocabulary ULOs, Grammar exercise blocks, CCQ prompts |
| **COSYtools** | Client-Side Offline Reference Engine (Conjugators, Declensions) | Tool-specific datasets (`tools/<lang>/`), Sharded dictionaries | Headword definitions, conjugation tables & grammatical rules |
| **COSYgames** | Suite of 20 Interactive Standalone Language Games | Game match state, Session scores, Local high score history | Mini-game content bundles (`cid_gamepack_*`) |
| **COSYevents** | Public Calendar Directory & Session Material Repository | Event definitions (`event.json`), Session JSONs (`public-events.json`) | Session prompt decks (`cid_eventpack_*`), Media assets |
| **COSYmanuals** | Public Catalog & Gated Learning Manuals Portal | Manual metadata (`catalog/*.json`), Curriculum maps, Gated text | Manual documentation nodes (`cid_manual_*`), Tooltips |
| **COSYmagazine** | Digital Publication, Flipbook & Podcast Station | Article JSON posts (`posts/*.json`), Podcast XML, Generated HTML | Article content nodes (`cid_article_*`), Inline Vocab |
| **COSYworld** | Standalone Open-World RPG in COSY Town (14 Languages) | Town map hotspots, Player RPG state, COSY Passport saves | NPC Dialogue trees (`cid_dialogue_*`), Quest scripts |

## 12 Core Application Modules

COSYstudio consists of 12 modern, integrated modules engineered for high-scale RLO composition:

1. **Dashboard**: Ecosystem content health, velocity metrics, and real-time activity stream.
2. **Content Library**: Central searchable database repository for all ULOs with Linear-style filtering and "Reused In" impact graphs.
3. **Curriculum**: Scope & sequence tree editor mapping ULOs into learning paths and CEFR tracks.
4. **Lesson Builder**: Notion-style slash command block editor and Figma-style canvas visualizer for interactive lesson flows.
5. **Vocabulary Database**: Master lexicon manager with IPA phonetics, multi-target translation matrices, and audio attachments.
6. **Grammar Database**: Canonical grammar rules with form-meaning-use breakdown blocks and pattern visualizers.
7. **Media Library**: Asset pipeline with automated audio-text alignment, video transcoding, and 3D asset ingestion.
8. **Assessment Builder**: Dynamic test generator, question variant transformer, and IRT difficulty calibrator.
9. **Publishing**: Multi-environment deployment pipeline (`DRAFT` -> `STAGING` -> `PRODUCTION`) with instant CDN cache invalidation.
10. **Analytics**: RLO Performance Index tracking exercise failure rates, drop-offs, and pedagogical effectiveness.
11. **AI Assistant**: Auto-generator for contextual sentences, CEFR estimator, and automated translator with 21 actions.
12. **Settings**: Role-based access control (RBAC), localization locales, webhooks, and schema contracts.

## Architectural Documentation

For complete detailed specifications, diagrams, matrices, shared schemas, and migration strategies, please refer to:

- 📖 **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Full Principal Architect specification document.
  - **Section 1**: Universal Learning Object (ULO) Architecture & 6 Core Dimensions
  - **Section 2**: Publishing as Transformation (Zero Duplication)
  - **Section 3**: Standardized ULO Metadata & TypeScript Schema
  - **Section 4**: Integrated AI Assistant Architecture & 21 Native Actions
  - **Section 5**: High-Level Ecosystem Architecture Diagram
  - **Section 6**: Visual Lesson Builder & 100% JSON Block Engine (Zero XML)
  - **Section 7**: Entity Relationship Diagrams (ERDs)
  - **Section 8**: Data Ownership Matrix (11 Repositories x Domains)
  - **Section 9**: Verified Repository Boundary Analysis (11 Repositories)
  - **Section 10**: Shared Packages (`@cosy/*`) & Governance
  - **Section 11**: 5-Phase Zero-Downtime Migration Strategy

## Guiding Architectural Axioms

1. **Universal Learning Object (ULO)**: Content exists once as a ULO primitive and is transformed for output targets rather than duplicated.
2. **Publishing as Transformation**: Dynamic target transformation compiles ULOs for web, mobile, 3D RPG, print PDF, and API outputs.
3. **Context-Aware AI Creator**: 21 actions aware of the entire 11-repository Knowledge Graph.
4. **Zero XML & 100% JSON Engine**: Fast, clean, type-safe block serialization.
5. **Folderless Database-First**: Dynamic metadata filtering replaces nested folder hierarchies.
