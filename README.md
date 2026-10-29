# COSYstudio - Central Content Operating System (COS)

Welcome to the architectural specification for **COSYstudio**, the central Content Operating System (COS) for the entire **COSYlanguages** ecosystem.

## Vision & Purpose

**COSYstudio is NOT an LMS.**

An LMS manages course enrollments, student rosters, grades, and subscriptions. **COSYstudio** is the single source of truth (SSOT) for all content creation, localization, versioning, taxonomy, media asset pipelines, and edge content distribution across all COSY ecosystem applications.

Content exists **once** in COSYstudio. Every other application references content nodes by immutable Content Identifiers (`cid`).

## Ecosystem Repositories & Boundaries

| Repository | Domain Responsibility | Data Owned | Consumes From COSYstudio |
| :--- | :--- | :--- | :--- |
| **COSYstudio** | Content Operating System (CMS, Localization, Assets) | Content Nodes, Media Manifests, Localization Keys, Taxonomy | Core Provider |
| **COSYlanguages** | Primary Learning Platform & Pedagogy Engine | User SRS state, Lesson progress, Course rosters | `ContentNode` by `cid`, UI Localizations |
| **COSYworld** | 3D Spatial Language Environment | Avatar cosmetics, Spatial instance state | NPC Dialogue trees, Quest scripts, Spatial Audio URLs |
| **COSYgames** | Gamified Micro-Games & Interactive Challenges | Game sessions, High scores, Leaderboards | Gamepack bundles (`cid_gamepack_*`), Media |
| **COSYtools** | Dictionaries, Analyzers, Browser Extensions | User tool preferences, Search cache | Direct dictionary query API, CEFR metadata |
| **COSYdata** | Telemetry, Analytics, Data Lake & AI/ML | Behavioral telemetry logs, ML models | Event streams (`content.published`), Tags |
| **COSYmagazine** | Digital Culture Magazine & Publishing | Article comments, Reading bookmarks | Article content nodes (`cid_article_*`), Inline Vocab |
| **Future Apps** | Special Audience Apps (COSYkids, COSYbusiness) | Custom UI state, Team hierarchies | Slices of tagged content nodes & media |

## Architectural Documentation

For complete detailed specifications, diagrams, matrices, shared schemas, and migration strategies, please refer to:

- 📖 **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Full Principal Architect specification document.
  - **Section 1**: Repository Boundary Analysis (5 required questions per repo)
  - **Section 2**: High-Level Architecture Diagram
  - **Section 3**: Data Ownership Matrix
  - **Section 4**: Repository Interaction Diagram (Mermaid)
  - **Section 5**: Shared Packages & Governance (`@cosy/...`)
  - **Section 6**: Shared Schemas (TypeScript `ContentNode`, `LocalizationKey`, `UserProgressReference`)
  - **Section 7**: 5-Phase Migration Strategy

## Guiding Architectural Axioms

1. **Content Centralization**: No downstream application creates or stores raw content tables.
2. **Decoupled Identity (`cid`)**: Downstream applications store only immutable content IDs (`cid_*`).
3. **Event-Driven Propagation**: Content updates publish via Kafka/NATS event bus to invalidate CDN/Redis caches.
4. **Typed Schema Enforcement**: Shared `@cosy/schema-content` package ensures contract safety across web, mobile, 3D (Unity/C#), and backend services.
