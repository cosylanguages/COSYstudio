# @cosy/studio-core

Canonical copy of `studio-core.js`, the kernel shared by the COSY studios.

Until now this file was vendored (byte-identical) into `COSYmagazine/js/` and
`COSYmanuals/shared/studio/`. This is its single home. The vendored copies are
**not yet replaced**: switching each studio to import this file is a separate,
per-repo change (see docs/ECOSYSTEM_REORG_PLAN.md, Phase 2).

It holds only what every studio needs: roles, verified sign-in (a role is trusted
only when the server confirmed it), a crash-safe local draft store, and one result
shape for readiness checks. The real publishing gate is always the database (row-level security).

Source md5 at the time of the move: `9f4293bda8ebbbe40e5e633ad9816b58`.

Tests: `npm test` at the repository root.
