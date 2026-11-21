# Changelog

## V0.15 — Multi-point Contact & Friction Solver
- Add reference/incident face clipping after GJK/EPA to build multi-point contact manifolds.
- Add six-iteration sequential impulses with accumulated normal and Coulomb friction impulses.
- Add rolling resistance and multi-point ground contact resolution.
- Add material-specific toughness, friction and rolling tuning; retain cap as compatibility alias.
- Add EWMA-driven adaptive GJK cell-pair budget and conservative sphere fallback.
- Add telemetry for contact points, friction impulse, adaptive budget and budget fallbacks.
- Preserve V0.14 GJK/EPA and contact-island behavior.
