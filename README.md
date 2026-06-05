# AI × Web3 School Cohort 0

> 学员：Tiya Degurechaff | GitHub: @tiyadegure
> Track: AI × Web3 Agentic Builders Hackathon

---

## 🎯 黑客松项目：AuditAgent

**AI 多代理智能合约安全审计系统**

| 项目 | 内容 |
|------|------|
| 赛道 | Z.AI — Web3 × Long-Horizon Task |
| 核心能力 | 5 Agent 协作 + 6 工具链 + Detect→Patch→Exploit 端到端闭环 |
| 技术栈 | CrewAI + Slither + Foundry + ChromaDB + GLM-5.1 |

### 5 Agent 架构

```
输入合约 → [Auditor] → [Architect] → [Code Generator] → [Refiner] → [Validator]
              ↓              ↓               ↓               ↓            ↓
           Slither        RAG            Code Gen         Review       Forge
              ↓              ↓               ↓               ↓            ↓
           漏洞报告      修复方案         修复代码         优化代码     验证结果
                                                                              ↓
                                                                       链上存证
```

### 技术栈

| 组件 | 技术 |
|------|------|
| AI 模型 | GLM-5.1（Z.AI API） |
| 多代理框架 | CrewAI |
| 静态分析 | Slither |
| 合约执行 | Foundry (Forge) |
| 知识库 | ChromaDB + RAG |
| 链上集成 | web3.py |

### 相关文档

- [项目结构](tasks/week3-repo-skeleton.md)
- [Week 4 Sprint Plan](tasks/week3-week4-sprint-plan.md)
- [Proposal Memo](tasks/week3-proposal-memo.md)
- [项目流程图](tasks/week3-project-flowchart.md)
- [技术验证计划](tasks/week3-tech-validation-plan.md)
- [深度研究包](tasks/week3-deep-research.md)
- [Z.AI 集成方案](tasks/week3-sponsor-sdk-integration-plan.md)
- [Cobo 赛道分析](tasks/week3-cobo-track-alignment.md)

---

## 📊 学习进度

### AI Foundation：11/11 ✅
LLM / Prompt / Context / RAG / Agent / Frameworks / Vibe Coding / MCP / Evaluation / Fine-tuning / Inference

### Web3 Foundation：进行中
优先 Security 和 Account Abstraction

### Bridge 系列：15/15 ✅
Chain-aware Context → Decentralized AI

---

## 📅 每日笔记

| 日期 | 主题 |
|------|------|
| [5.21](daily/2026-05-21.md) | Web3 运行原理 + Co-learning |
| [5.22](daily/2026-05-22.md) | Web3 Tool Use + Week 1 例会 |
| [5.23](daily/2026-05-23.md) | Agent Workflow + Open Agentic Economy |
| [5.24](daily/2026-05-24.md) | Agent Wallet + 合约部署 |
| [5.25](daily/2026-05-25.md) | 合约部署 + 隐私协议 |
| [5.26](daily/2026-05-26.md) | Agent Identity + Trust + AI Oracle |
| [5.27](daily/2026-05-27.md) | AI Privacy + Sovereignty + Governance |
| [5.28](daily/2026-05-28.md) | Co-learning |
| [5.29](daily/2026-05-29.md) | Agentic Commerce |
| [5.30](daily/2026-05-30.md) | 学习总结 |
| [5.31](daily/2026-05-31.md) | AI 基础三章 |
| [6.01](daily/2026-06-01.md) | AI Foundation 11/11 完成 |
| [6.03](daily/2026-06-03.md) | 提交 12 个任务 (280 pts) |
| [6.04](daily/2026-06-04.md) | 支付场景 + Cobo 分析 |
| [6.05](daily/2026-06-05.md) | Week 3 总结 + Week 4 计划 |

---

## 📊 任务提交记录

### Week 3 已提交（21 个任务，435 pts）

| 积分 | 任务 |
|------|------|
| 20 | Openday 实时参加 |
| 20 | Repo Skeleton |
| 20 | Week 4 Sprint Plan |
| 20 | Proposal Memo |
| 20 | Scope Review |
| 20 | Risk / Assumption Memo |
| 20 | Sponsor / Mentor 问题清单 |
| 30 | 深度研究包 |
| 30 | 项目流程图 |
| 30 | 技术验证计划 |
| 40 | 完整 Week 4 Ready Pack |
| 10 | 黑客松网站 Bug 反馈 |
| 30 | Sponsor SDK/API Integration Plan |
| 20 | 黑客松赛道实战 |
| 20 | 支付场景的探索和思考 |
| 30 | Cobo 赛道对齐任务 |
| 20 | Workshop 笔记 |
| 5 | Weekly Review 6.05 |
| 10 | 寻找 Hackathon 队友 |
| 20 | AI Agent 时代与区块链技术选择 |
| 20 | Week 3 例会 |

---

## 📆 Week 4 计划

| 日期 | 任务 |
|------|------|
| 6.09 | 环境搭建 + Agent 框架 |
| 6.10 | 工具链集成（Slither/Forge） |
| 6.11 | RAG 知识库搭建 |
| 6.12 | Detect 模式可用 + 提交 |
| 6.13 | 提交截止 12:00 |
| 6.14 | Demo Day |

---

## 🔗 相关链接

- [ETH Beijing 项目](https://github.com/tiyadegure/eth-beijing-2026)
- [Z.AI 开发者文档](https://docs.z.ai/devpack/overview)
- [Cobo Agentic Wallet](https://www.cobo.com/agentic-wallet)

---

*AI × Web3 School Cohort 0 | LXDAO + ETHPanda*
