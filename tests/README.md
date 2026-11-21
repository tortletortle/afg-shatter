# V0.16 算法测试

本轮测试从 `index.html` 与 `compat.html` 抽取生产物理函数，在确定性 V8 harness 中运行，不启动完整页面。两个构建的 6 个内联脚本块均通过语法编译。

- `v16WarmStartTests()`：缓存建立、反向刚体顺序匹配、冲量复用与缓存过期。
- `v16IterationPolicyTests()`：2 / 4 / 6 / 8 轮自适应策略边界。
- `v16RestingContactBenchmark()`：调用生产 `v15GroundResolve`，执行 360 步四点地面接触，对比热启动与冷启动的迭代工作量、穿透和接触后速度。

Warm Start、迭代策略与 360 步地面接触基准在两个构建中结果一致。本地执行命令：`node tests/v16_warm_start_harness.js`（Node.js 22）。GitHub Actions 工作流也会在该分支 push 时自动执行。

结果与测试边界记录在 `VALIDATION.md` 和 `benchmark/v16_results.json`。这些测试不替代浏览器启动、真实设备和 GPU 实机验收。
