# V0.18 验收记录

## 本轮代码范围
- 基线：v0.17-fixed-budget-scheduler，不是旧的 main 或早期 V0.15 HTML。
- 保留 V0.17 固定预算候选调度器、V0.16 持久接触热启动/自适应迭代和 V0.15 多点接触/摩擦。
- V0.18 新增开口铝罐局部塑性压痕与塑性耗能账本。

## 自动化验收
GitHub Actions 在 v0.18-plastic-can 上运行：
1. node tests/v16_warm_start_harness.js
2. node tests/v17_scalability_harness.js
3. node tests/v18_plastic_harness.js

V0.18 塑性 harness 从 index.html 与 compat.html 抽取生产函数，检查：
- 首次冲击进入屈服并产生永久压痕；
- 塑性耗能与剩余断裂能分账，能量残差闭合；
- 多次压痕达到每单元最大深度且不越界；
- 达到饱和的单元停止继续位移；
- 单元整体平移保持单元内部几何不变；
- 更新后的刚体包围半径与数值仍有限；
- WebGL2 与 Canvas2D 构建的物理逻辑一致。

## 验证边界
- 此 harness 是确定性 V8 函数级测试，使用合成凸单元，不等于完整浏览器交互测试。
- 当前没有宣称 V0.18 已在真实 Windows GPU、WebGL2、Android/iOS 触摸设备上通过实机验收。
- 塑性屈服、硬化、最大深度和耗能比例是游戏调校参数，未经真实铝罐实验标定。
- 单元通过刚性平移产生凹陷，不模拟连续壳体应变、折皱波传播或真实裂纹尖端。
- V0.17 scalability harness 的合成 100/300/500/1000 体压力测试不等于真实物理碰撞场景或浏览器 FPS 基准。

CI 通过后，将具体提交 SHA、运行链接和每组用例结果追加到本文件。
