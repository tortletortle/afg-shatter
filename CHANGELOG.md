# Changelog

## V0.14 — Convex Collision & Contact Islands
- Added GJK convex intersection tests and EPA penetration/contact estimation.
- Added per-cell convex support maps and cell-pair bounding-sphere pruning.
- Added 0.011 per-shape support contact skin and low-speed zero-restitution handling.
- Added approximate angular impulse response using scalar spherical inertia.
- Added persistent contact-island graph, island-wide sleeping and wake propagation.
- Added telemetry for GJK, EPA, fallback paths, contact pairs, islands and sleeping bodies.
- Preserved V0.13 broadphase, V0.12 hollow specimens and existing UI.
- No claim of full FEM, exact arbitrary-convex manifold response, PBF accuracy or GPU performance.
