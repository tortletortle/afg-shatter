# Changelog

## V0.18 — Aluminum-can plastic indentation
- Add yield-thresholded local indentation for the hollow aluminum can.
- Apply a smooth radial displacement field by rigidly translating convex shell cells; preserve each cell's volume, planarity and convexity.
- Accumulate bounded per-cell plastic offsets with a hardening factor; repeated impacts then continue through the existing bond-graph fracture path.
- Track plastic events, maximum indentation depth and plastic work separately from fracture energy.
- Extend runtime checks and reports with plastic-state finiteness, depth caps and energy-ledger accounting.
- Preserve the V0.17 fixed-budget scheduler, V0.17 wake telemetry, V0.16 warm-start cache and adaptive iteration policy, and V0.15 contact manifold/friction solver.

## V0.17 — Fixed-budget candidate scheduler
- Add a bounded candidate pool with per-body coverage and candidate-diversity selection.
- Group retained candidates into contact islands and schedule within a deterministic global narrow-phase budget.
- Track retained/deferred candidates, budget allocation/use, scheduler time and fallback counts.
- Add wake-event telemetry and deterministic scalability tests at 100/300/500/1000 bodies.
- Add Node.js 22 GitHub Actions validation for both app builds.

## V0.16 — Persistent Contact Warm Starting
- Add persistent contact cache keyed by rigid-body ID pairs.
- Match contacts using local-space anchors and normals; warm-start accumulated normal and tangential impulses.
- Add cache expiry/capacity and adaptive sequential-impulse iteration counts of 2/4/6/8.
- Apply warm starting and adaptive iterations to multi-point ground contacts.

## V0.15 — Multi-point Contact & Friction Solver
- Add clipped face-to-face contact manifolds, sequential normal/tangent impulses, Coulomb friction and rolling resistance.
- Add material-specific toughness, friction and rolling tuning.
- Add EWMA-driven adaptive GJK cell-pair budget and conservative sphere fallback.

## Known limitations
- V0.18 plastic indentation is a game-level discrete-cell approximation, not FEM or a calibrated aluminum constitutive model.
- No full inertia tensor; scalar inertia approximation remains.
- No persistent full manifold warm-start for every possible contact topology.
- Dense multi-body and fluid accuracy still require broader physical validation.
- WebGL2, real Windows GPU, mobile touch and device-specific performance are not yet certified.
