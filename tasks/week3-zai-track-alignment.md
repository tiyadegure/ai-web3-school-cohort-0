# Z.AI 赛道对齐任务

> 任务：Week 3｜Sponsor Workshop｜Z.AI 赛道对齐任务
> 学员：Tiya Degurechaff
> 日期：2026-05-31

## 赛道：Z.AI — Web3 × Long-Horizon Task

## 项目中 AI Agent 如何拆解复杂任务

审计一个智能合约是一个天然的 Long-Horizon Task，AuditAgent 将其拆解为 5 个阶段：

阶段 1 — 信息收集（Auditor Agent）：
- 调用 Slither 进行静态分析，获取控制流图和漏洞检测结果
- 调用 Source Fetcher 获取合约源码（支持代理合约解析）
- 调用 State Reader 查询链上状态快照（存储布局、余额、权限）
- 调用 Code Sanitizer 移除注释和空行，简化输入
- 输出：结构化的代码分析报告

阶段 2 — 漏洞识别（Auditor Agent + RAG）：
- 将 Slither 结果 + 代码语义送入 LLM 分析
- RAG 检索 ERC 标准文档和已知漏洞模式库
- Verificator 交叉验证：LLM 发现 vs Slither 发现 vs 知识库
- 输出：漏洞列表（位置、类型、严重级别、置信度）

阶段 3 — 修复策略（Architect Agent）：
- 针对每个漏洞制定修复策略
- 考虑修复之间的依赖关系（修 A 可能影响 B）
- 选择最小侵入性修复方案
- 输出：修复计划（优先级、方案、预期影响）

阶段 4 — 代码生成（Code Generator + Refiner Agent）：
- Code Generator 生成修复代码
- Refiner 检查代码质量、gas 优化、风格一致性
- 如果 Validator 验证失败，回退到 Refiner 重新优化
- 迭代循环直到修复代码通过所有验证
- 输出：修复后的完整合约代码

阶段 5 — 端到端验证（Validator Agent）：
- 调用 Forge 生成 PoC exploit（证明漏洞可利用）
- 调用 Forge 运行修复后的测试（证明修复有效）
- 生成对比报告：修复前 vs 修复后
- 输出：验证报告 + PoC 代码 + 测试结果

## 如何持续调用工具

整个审计流程涉及 6 个领域特定工具的持续调用：

| 工具 | 调用时机 | 作用 |
|------|----------|------|
| Slither | 阶段 1 | 静态分析，获取漏洞检测结果 |
| Source Fetcher | 阶段 1 | 获取合约源码，解析代理合约 |
| State Reader | 阶段 1 | 查询链上状态（存储、余额、权限） |
| Code Sanitizer | 阶段 1 | 简化代码输入 |
| Concrete Execution (Forge) | 阶段 4-5 | PoC 生成、测试执行、验证修复 |
| Revenue Normalizer | 阶段 5 | 标准化损失金额评估 |

每次工具调用的结果会决定下一步行动：
- Slither 发现高危漏洞 → 触发更深入的语义分析
- Forge PoC 执行失败 → 回退到 Refiner 重新生成修复代码
- State Reader 发现代理合约 → 触发 Source Fetcher 解析实现合约

## 如何迭代修复

Detect → Patch → Validate 的核心循环：

第 1 轮：Auditor 检测到 3 个漏洞（reentrancy, unchecked-send, missing-access-control）
第 1 轮：Code Generator 生成修复代码
第 1 轮：Validator 用 Forge 验证 → reentrancy 修复通过，unchecked-send 修复失败
第 2 轮：Refiner 分析失败原因（修复代码未处理所有调用路径）
第 2 轮：Code Generator 重新生成 unchecked-send 修复
第 2 轮：Validator 再次验证 → 全部通过
最终输出：3 个漏洞全部修复，PoC 验证通过

这种迭代循环是 Long-Horizon Task 的核心 — 不是一次性输出，而是持续改进直到端到端验证通过。

## 从需求到交付的完整 Web3 工作流

输入：一个 Solidity 合约地址（或本地文件）
处理：5 个 Agent + 6 个工具 + RAG 知识库的多轮协作
输出：
- 审计报告（JSON + Markdown）
- 修复后的合约代码
- PoC exploit 代码
- Forge 测试结果
- 链上审计证明（可选）

这正是 Z.AI 赛道所定义的「从需求到交付的 Web3 工作流」。
