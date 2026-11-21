# Changelog

## V0.13 — Algorithm Optimization
- Replace center-only rigid-body broadphase with conservative multi-cell AABB spatial hashing.
- Add cell-local bond adjacency and reuse local graph snapshots during fracture propagation.
- Add Verlet-skin PBF neighbor lists with displacement-triggered rebuilds for fluid and wall samples.
- Add a conservative fluid-contact radius separate from the geometry radius.
- Add collision-candidate and neighbor-list telemetry.
- Preserve V0.12 geometry, materials, tools, UI flows and composite samples.
- Correct report metadata to identify V0.13.
