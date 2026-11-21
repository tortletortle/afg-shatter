# Changelog

## V0.17 — Budgeted Contact-Island Scheduling
- Build connected contact islands from current broad-phase candidate pairs.
- Allocate the global GJK cell-pair budget per island using collision priority, island size and starvation age.
- Guarantee one service slot per island while budget permits; use aging to rotate service when islands outnumber available slots.
- Enforce per-island and global test budgets; retain conservative sphere fallback for unserved/exhausted pairs.
- Add island allocation, service, actual-use and fallback telemetry.
- Add frame-interval P95/P99 and physics-step P95/P99 timing telemetry.
- Port identical scheduler behavior to WebGL-first and forced-Canvas2D builds.
- Add deterministic 100/300/500/1000 synthetic scheduler scale harness and CI workflow.

## V0.16 — Persistent Contact Warm Starting
- Add a persistent rigid-body contact cache using canonical body IDs and local-space anchors/normals.
- Warm-start accumulated normal and tangential impulses; release stale friction when normal support vanishes.
- Add cache expiry/capacity controls and adaptive 2/4/6/8 sequential-impulse iterations.
- Apply the same solver and diagnostics to multi-point ground contacts and the Canvas2D compatibility build.

## V0.15 — Multi-point Contact & Friction Solver
- Add reference/incident face clipping after GJK/EPA to build multi-point contact manifolds.
- Add sequential impulses, Coulomb friction, rolling resistance and multi-point ground contact.
- Add material tuning and EWMA-driven adaptive GJK cell-pair budget.
