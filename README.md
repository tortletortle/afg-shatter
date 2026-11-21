# AFG / 万物粉碎 — V0.18 铝罐塑性压瘪版

V0.18 建立在已验证的 V0.17 固定预算候选调度器之上，保留 V0.16 持久接触热启动、自适应迭代、V0.15 多点接触流形与摩擦，以及此前的 GJK/EPA、接触岛、中空容器和 PBF 实验。

## V0.18 新增：铝罐先压瘪、再撕裂
- 仅对开口铝罐（hollowCan）启用，其他材料与形状仍使用原有断裂路径。
- 冲击能量跨过屈服阈值后，局部壳体凸单元产生永久径向压痕。
- 多次冲击累积塑性位移；每个单元有最大压痕深度和硬化调节。
- 压痕过程消耗的能量单独记入 plasticWork；剩余能量进入原有 bond graph 断裂系统。
- 更新 AFG.report()、AFG.check() 与 AFG.plasticReport()，将塑性耗能纳入能量账本。

**模型边界：**这是离散凸单元刚性平移近似，不是 FEM、壳单元有限元或经过真实铝材实验标定的本构模型。它能提供可交互的低多边形压瘪/撕裂体验，但不能用于材料力学预测。

## 保留的研发成果
- V0.17 固定预算候选池、单体覆盖、候选多样性、接触岛分组与延迟候选调度。
- V0.17 休眠岛唤醒事件遥测。
- V0.16 跨帧接触缓存、局部锚点匹配、热启动法向/切向冲量、缓存过期与自适应 2/4/6/8 轮求解。
- V0.15 多点接触流形、库仑摩擦、滚动阻力和材料摩擦参数。
- GJK/EPA、接触岛、中空玻璃瓶/陶土花盆/金属罐、流体与解压模式。

## 运行
- index.html：WebGL2 优先，不可用时回退 Canvas2D。
- compat.html：强制 Canvas2D。
- Windows 双击 start.bat。
- ChatGPT 内置预览可能限制页面脚本；请在 Edge / Chrome 独立窗口打开。

## 测试
- node tests/v16_warm_start_harness.js
- node tests/v17_scalability_harness.js
- node tests/v18_plastic_harness.js

GitHub Actions 在 v0.18-plastic-can 分支自动运行三组回归，并生成完整项目 ZIP 与 Windows 启动包。测试范围与限制见 VALIDATION.md。
