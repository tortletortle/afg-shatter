# V0.13 Validation Summary

See README.md for full methodology and limitations.

| Suite | Cases | Result |
|---|---:|---|
| Hollow geometry | 3 | Pass |
| Multi-seed fracture | 9 | Pass |
| Legacy entries | 17 | Pass |
| Random AABB broadphase | 5 × 360 synthetic bodies | 0 missed overlapping pairs |
| PBF neighbor coverage | 6 × 80 steps | 0 fluid / wall neighbor omissions |
| Fluid-solid coupling | 1 stress replay | Pass; momentum residuals near machine precision |
| Responsive layouts and interaction | 3 | Pass |

Performance comparisons are headless Chromium Canvas2D measurements. They are not device or GPU benchmarks. PBF physical accuracy remains unresolved.
