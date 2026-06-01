# Hackathon Direction Card

> 任务：Week 3｜最低完成路径｜Hackathon Direction Card
> 学员：Tiya Degurechaff
> 日期：2026-05-31

## 基本信息

- 参赛赛道：Z.AI — Web3 × Long-Horizon Task
- 项目名称：AuditAgent
- 团队：单人参赛
- GitHub：https://github.com/tiyadegure/eth-beijing-2026

## 目标用户

DeFi 协议开发者和智能合约审计师。他们在部署合约前需要快速、低成本的安全检查，但传统人工审计耗时长（2-4周）且成本高（$60k+）。

## 要解决的问题

1. 传统审计工具（Slither/Myril）只能检测已知模式，无法理解代码语义
2. AI 单 Agent 审计缺乏专业分工，准确率不够
3. 检测到漏洞后没有端到端验证（只报告不验证修复是否有效）
4. 审计结果不可链上验证

## 最小功能（MVP）

1. **Detect 模式**：输入合约 → Slither 静态分析 + AI 语义审计 → 输出漏洞列表（位置、类型、严重级别）
2. **Patch 模式**：针对检测到的漏洞 → Agent 生成修复代码 → Forge PoC 验证修复有效性
3. **Exploit 模式**：端到端验证 — 生成 PoC exploit 证明漏洞可被利用
4. **审计报告**：结构化输出（JSON + 人类可读报告），含验证证据

## 技术路径

```
多Agent层 (CrewAI)          工具层 (A1论文)           知识层 (RAG)         验证层 (EVMbench)
├── Auditor Agent           ├── Slither 工具          ├── ERC 标准库        ├── Detect 评估
├── Architect Agent         ├── Source Fetcher        ├── 漏洞模式库        ├── Patch 评估
├── Code Generator Agent    ├── State Reader          └── Verificator       └── Exploit 评估
├── Refiner Agent           ├── Code Sanitizer
└── Validator Agent         ├── Concrete Execution (Forge)
                            └── Revenue Normalizer
```

AI 模型：MiMo V2.5 Pro（直连 API）
框架：CrewAI 多代理
静态分析：Slither
合约执行：Foundry (Forge)
知识库：ChromaDB + RAG
链上集成：web3.py
MCP：Python SDK

## 主要风险

1. **LLM 幻觉**：Agent 可能报告不存在的漏洞 → 缓解：所有漏洞必须有 Slither 或 Forge PoC 验证
2. **72h 时间不够** → 缓解：MVP 只做 Solidity 单合约，不做多链/多文件
3. **MiMo API 限流** → 缓解：准备 Claude/GPT-4 作为 fallback
4. **Forge PoC 编写困难** → 缓解：使用 forefy/.context 的 PoC 模板

## 差异化（vs 竞品）

| 维度 | forefy/.context | jsmaxi/audit-agent | AuditAgent |
|------|-----------------|---------------------|------------|
| Agent 数量 | 1 | 1 | 5（专业分工） |
| 验证方式 | 报告 | 报告 | PoC exploit |
| 评估模式 | 无 | 无 | Detect/Patch/Exploit |
| RAG 知识库 | Skills | 无 | ChromaDB + ERC |
| MCP 集成 | 无 | 无 | 有 |
