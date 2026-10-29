# COSYstudio - Central Content Operating System (COS)

Welcome to the architectural specification for **COSYstudio**, the central Content Operating System (COS) for the entire **COSYlanguages** ecosystem.

## Vision & Purpose

**COSYstudio is NOT an LMS.**

An LMS or platform service manages user accounts, course enrollments, student rosters, event tickets, and subscriptions. **COSYstudio** is the single source of truth (SSOT) for all content creation, localization, versioning, taxonomy, media asset pipelines, and edge content distribution across all 11 repositories in the `cosylanguages/` organization.

Designed as a modern, high-velocity block-based creator application inspired by **Notion**, **Linear**, **Figma**, **ProgressMe**, and **Edvibe**, COSYstudio powers thousands of Reusable Learning Objects (RLOs) without content duplication.

Content exists **once** in COSYstudio. Every other application references content nodes by immutable Content Identifiers (`cid`).

## Complete Ecosystem Repositories & Boundaries (11 Repositories)

| Repository | Domain Responsibility | Data Owned | Consumes From COSYstudio |
| :--- | :--- | :--- | :--- |
| **COSYstudio** | Central Content Operating System (CMS, Localization, Asset Pipelines) | Content Nodes, Media Manifests, Localization Keys, Taxonomy | Core Provider |
| **COSYplatform** | Central Identity Provider (SSO), Auth, Billing & Global API Gateway | User Auth Credentials, Billing & Subscription Plans | Localized legal strings & tier descriptions (`cid_loc_*`) |
| **COSYlanguages** | Primary Language Learning Application & SRS Pedagogy Engine | User SRS card states, Lesson progress, Course rosters | `ContentNode` by `cid`, UI Localizations |
| **COSYpractice** | Specialized Interactive Drill Engine & Speech Evaluation | Practice session runs, Audio recording submissions | Drill definitions (`cid_drill_*`), Audio prompts & rubrics |
| **COSYworld** | Immersive 3D Spatial Language Environment Engine | Avatar cosmetics, Spatial instance state | NPC Dialogue trees, Quest scripts, Spatial Audio URLs |
| **COSYgames** | Gamified Micro-Games, Matchmaking & Arcade Engine | Game sessions, High scores, Leaderboards | Gamepack bundles (`cid_gamepack_*`), Media |
| **COSYtools** | Utility Tools: Dictionaries, CEFR Analyzers, Extensions | User tool preferences, Search cache | Direct dictionary query API, CEFR metadata |
| **COSYdata** | Telemetry Ingestion, Data Lakehouse & AI/ML Pipelines | Behavioral telemetry logs, Trained ML models | Event streams (`content.published`), Taxonomy Tags |
| **COSYmagazine** | Editorial Publishing & Digital Cultural Publication | Article comments, Reading bookmarks | Article content nodes (`cid_article_*`), Inline Vocab |
| **COSYevents** | Live Webinars, Workshops, Meetups & WebRTC Rooms | Event schedules, RSVPs, Tickets, WebRTC tokens | Event material bundles (`cid_eventpack_*`), Media |
| **COSYmanuals** | User Guides, App Documentation & Support Help Center | Support help tickets, Vote ratings | Documentation articles (`cid_manual_*`), Tooltips |

## 12 Core Application Modules

COSYstudio consists of 12 modern, integrated modules engineered for high-scale RLO composition:

1. **Dashboard**: Ecosystem content health, velocity metrics, and real-time activity stream.
2. **Content Library**: Central searchable repository for all RLOs with Linear-style filtering and "Reused In" impact graphs.
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
  - **Section 1**: Repository Boundary Analysis (11 Repositories: 5 questions each)
  - **Section 2**: Navigation Architecture & Workspace Layout
  - **Section 3**: Detailed 12 Application Modules (Inspirations, Purpose & Core Features)
  - **Section 4**: Authoring & Content Workflows (Mermaid Sequence Diagrams)
  - **Section 5**: High-Level Architecture Diagram
  - **Section 6**: Data Ownership Matrix (11 Repositories x Domains)
  - **Section 7**: Shared Packages & Governance (`@cosy/...`)
  - **Section 8**: Shared Schemas (TypeScript `ContentNode`, `UserProgressReference`)
  - **Section 9**: 5-Phase Zero-Downtime Migration Strategy

## Guiding Architectural Axioms

1. **Content Centralization**: No downstream application creates or stores raw content tables.
2. **Decoupled Identity (`cid`)**: Downstream applications store only immutable content IDs (`cid_*`).
3. **Event-Driven Propagation**: Content updates publish via Kafka/NATS event bus to invalidate CDN/Redis caches.
4. **Typed Schema Enforcement**: Shared `@cosy/schema-content` package ensures contract safety across web, mobile, 3D (Unity/C#), and backend services.
