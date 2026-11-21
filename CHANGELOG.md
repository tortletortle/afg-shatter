# Changelog

## V0.16 — Persistent Contact Warm Starting
- Add a persistent contact cache keyed by rigid-body ID pairs.
- Match contacts one-to-one using local-space anchors and local-space normals in a canonical body frame.
- Warm-start accumulated normal and tangential impulses; reproject cached friction impulses onto the current contact plane, clamp to the Coulomb limit, and remove stale friction when normal support vanishes.
- Add cache expiry (3 unseen simulation steps) and a 4096-pair capacity limit.
- Add adaptive sequential-impulse iteration counts: 2 / 4 / 6 / 8 according to warm-start coverage, approach speed and penetration depth.
- Apply warm starting and adaptive iterations to multi-point ground contacts.
- Port the same V0.16 physics solver and diagnostics to the forced-Canvas2D compatibility build.
- Add warm-start hit, applied-impulse, cache-size and average-iteration telemetry.

## V0.15 — Multi-point Contact & Friction Solver
- Add reference/incident face clipping after GJK/EPA to build multi-point contact manifolds.
- Add six-iteration sequential impulses with accumulated normal and Coulomb friction impulses.
- Add rolling resistance and multi-point ground contact resolution.
- Add material-specific toughness, friction and rolling tuning; retain cap as compatibility alias.
- Add EWMA-driven adaptive GJK cell-pair budget and conservative sphere fallback.
- Add telemetry for contact points, friction impulse, adaptive budget and budget fallbacks, including ground contacts.
- Preserve V0.14 GJK/EPA and contact-island behavior.
