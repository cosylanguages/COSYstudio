# COSYstudio - Central Content Operating System (COS)

Welcome to the architectural specification for **COSYstudio**, the central Content Operating System (COS) for the entire **COSYlanguages** ecosystem.

## Vision & Purpose

**COSYstudio is NOT an LMS.**

An LMS or platform service manages user accounts, course enrollments, student rosters, event tickets, and subscriptions. **COSYstudio** is the single source of truth (SSOT) for all content creation, localization, versioning, taxonomy, media asset pipelines, and edge content distribution across all 11 repositories in the `cosylanguages/` organization.

Content exists **once** in COSYstudio. Every other application references content nodes by immutable Content Identifiers (`cid`).

## Complete Ecosystem Repositories & Boundaries (11 Repositories)

| Repository | Domain Responsibility | Data Owned | Consumes From COSYstudio |
| :--- | :--- | :--- | :--- |
| **COSYstudio** | Content Operating System (CMS, Localization, Assets) | Content Nodes, Media Manifests, Localization Keys, Taxonomy | Core Provider |
| **COSYplatform** | Identity Provider (SSO), Auth, Billing & Gateway | User Auth Credentials, Billing & Subscription Plans | Localized legal strings & tier descriptions (`cid_loc_*`) |
| **COSYlanguages** | Primary Learning Platform & Pedagogy Engine | User SRS state, Lesson progress, Course rosters | `ContentNode` by `cid`, UI Localizations |
| **COSYpractice** | Interactive Drill Engine & Speech Evaluation | Practice session runs, Audio recording submissions | Drill definitions (`cid_drill_*`), Audio prompts & rubrics |
| **COSYworld** | 3D Spatial Language Environment | Avatar cosmetics, Spatial instance state | NPC Dialogue trees, Quest scripts, Spatial Audio URLs |
| **COSYgames** | Gamified Micro-Games & Interactive Challenges | Game sessions, High scores, Leaderboards | Gamepack bundles (`cid_gamepack_*`), Media |
| **COSYtools** | Dictionaries, Analyzers, Browser Extensions | User tool preferences, Search cache | Direct dictionary query API, CEFR metadata |
| **COSYdata** | Telemetry, Analytics, Data Lake & AI/ML Models | Behavioral telemetry logs, Trained ML models | Event streams (`content.published`), Tags |
| **COSYmagazine** | Digital Culture Magazine & Editorial Publishing | Article comments, Reading bookmarks | Article content nodes (`cid_article_*`), Inline Vocab |
| **COSYevents** | Live Webinars, Meetups & Workshops | Event schedules, RSVPs, Tickets, WebRTC rooms | Event material bundles (`cid_eventpack_*`), Media |
| **COSYmanuals** | User Documentation, Onboarding & Help Desk | Support help tickets, Vote ratings | Documentation articles (`cid_manual_*`), Tooltips |

## Architectural Documentation

For complete detailed specifications, diagrams, matrices, shared schemas, and migration strategies, please refer to:

- 📖 **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Full Principal Architect specification document.
  - **Section 1**: Repository Boundary Analysis (11 Repositories: 5 questions each)
  - **Section 2**: High-Level Architecture Diagram
  - **Section 3**: Data Ownership Matrix (11 Repositories x Domains)
  - **Section 4**: Repository Interaction Diagram (Mermaid Sequence Diagram)
  - **Section 5**: Shared Packages & Governance (`@cosy/...`)
  - **Section 6**: Shared Schemas (TypeScript `ContentNode`, `UserProgressReference`)
  - **Section 7**: 5-Phase Zero-Downtime Migration Strategy

## Guiding Architectural Axioms

1. **Content Centralization**: No downstream application creates or stores raw content tables.
2. **Decoupled Identity (`cid`)**: Downstream applications store only immutable content IDs (`cid_*`).
3. **Event-Driven Propagation**: Content updates publish via Kafka/NATS event bus to invalidate CDN/Redis caches.
4. **Typed Schema Enforcement**: Shared `@cosy/schema-content` package ensures contract safety across web, mobile, 3D (Unity/C#), and backend services.
