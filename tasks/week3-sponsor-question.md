# 赞助方问题收集

> 任务：Week 3｜赞助方问题收集｜给 Cobo / Z.AI 的问题
> 学员：Tiya Degurechaff
> 日期：2026-05-31

赞助方：Z.AI

问题：Z.AI 的 Long-Horizon Task 框架是否支持 Agent 之间的状态共享和任务依赖管理？比如在多 Agent 审计场景中，Auditor Agent 的漏洞发现结果需要实时传递给 Architect Agent 制定修复策略，这种跨 Agent 的上下文传递和任务编排，Z.AI 有什么推荐的实现模式？

背景 / 卡点：目前项目用 CrewAI 的 sequential process 做多 Agent 编排，但担心在长任务场景下上下文窗口会被中间结果填满，导致后续 Agent 看不到关键信息。

希望分享会回答：Z.AI 在处理长任务时的上下文管理策略，以及是否有内置的任务图（task graph）或检查点（checkpoint）机制。
