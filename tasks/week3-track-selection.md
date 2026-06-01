# 赛道选择说明

> 任务：Week 3｜最低完成路径｜赛道选择说明
> 学员：Tiya Degurechaff
> 日期：2026-05-31

## 选择赛道：Z.AI — Web3 × Long-Horizon Task

## 为什么选 Z.AI？

AuditAgent（AI 智能合约安全审计代理）是一个典型的 Long-Horizon Task：

1. **任务拆解**：审计一个智能合约需要 5 个专门 Agent 分工协作 — Auditor 分析漏洞、Architect 制定修复策略、Code Generator 生成补丁、Refiner 迭代优化、Validator 验证修复有效性。这不是单步问答，而是一个多阶段工作流。

2. **持续工具调用**：整个审计流程需要持续调用多种工具 — Slither 静态分析、链上状态查询（RPC）、Forge 执行验证（PoC）、RAG 知识库检索（ERC 标准和漏洞模式）。每次工具调用的结果会影响下一步决策。

3. **迭代修复**：Detect → Patch → Validate 不是一次性完成的。Validator 发现修复无效时，需要回退到 Refiner 重新优化，再回到 Validator 验证，直到端到端通过。这种迭代循环是 Long-Horizon Task 的核心特征。

4. **从需求到交付**：输入一个合约地址，输出完整的审计报告 + 修复代码 + PoC exploit + 链上证明。这个端到端流程需要多轮推理和工具协作。

## 为什么不选 Cobo？

Cobo 赛道聚焦 Agentic Wallet — Agent 持有钱包、管理预算、执行支付。AuditAgent 的核心能力是安全审计，不是钱包管理。虽然可以包装成「交易前安全检查层」，但核心功能和赛道定义有差距，不如 Z.AI 的 Long-Horizon Task 来得自然。

## 一句话总结

智能合约审计 = 拆解 + 持续调用工具 + 迭代修复 + 端到端交付，这就是 Long-Horizon Task。
