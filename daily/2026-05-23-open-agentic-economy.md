# 2026-05-23 Open Agentic Economy 活动笔记

## 活动信息
- **日期：** 2026-05-23 19:00-20:30
- **主讲人：** Sophia（Ethereum Foundation, Developer Acceleration）
- **主题：** Open Agentic Economy — Agent 身份、交易与可编程货币

---

## 关键收获

### 1. CROPS 框架（Agent 能力五层）
Sophia 提出 Agent 能力框架：
- **C (Context):** Agent 获取上下文的能力
- **R (Reasoning):** 推理能力
- **O (Orchestration):** 多 Agent 编排协调
- **P (Payment/Provable):** 支付与可验证执行（Web3 核心价值层）
- **S (Sovereignty):** 自主权（Agent 独立运行、拥有资产）

### 2. ERC-8004: Agent Identity
以太坊为 Agent 设计的新标准，分三部分：
- **Identity Registry:** 链上注册 Agent 身份（类似域名系统）
- **Reputation Registry:** 链上声誉记录（可验证的 Agent 历史表现）
- **Validation Registry:** Agent 行为验证机制

### 3. 可编程货币 vs 可验证执行
- **可编程货币（Programmable Money）：** Agent 自主发起支付、订阅、条件触发转账
- **可验证执行（Provable Execution）：** 通过 TEE/ZK 证明 Agent 确实执行了任务，无需信任第三方

### 4. EF 内部 AI 实践
- 代码辅助（Copilot 类工具）提升开发者效率
- 项目评估（用 AI 分析 grant 申请）
- 财务报告自动化
- **最大应用领域：支付**（Agent 自主完成支付交易）

### 5. 去中心化 Agent 经济愿景
Agent 不仅是工具，而是经济参与者：
- 拥有链上身份和声誉
- 自主管理资产和支付
- 通过可证明确保可信执行
- 形成 Agent-to-Agent 市场

---

## 与 Web3 Tool Use（Day 2）的关联

| Day 2 学的 | 今天看到的扩展 |
|---|---|
| Agent 调用链上工具（读余额、查交易） | Agent 不仅读，还能**自主写入**（发起交易、支付） |
| Explorer Context 提供数据 | ERC-8004 提供 Agent **身份和声誉**数据 |
| Tool Use 是单向调用 | CROPS 框架的 P 层让 Agent 双向参与经济 |

---

## 我的判断

Sophia 的分享让我意识到：**Web3 对 AI Agent 的价值不只是"数据透明"，而是"经济自主权"。**

之前的理解停留在"Agent 用区块链查数据"，今天看到的是"Agent 在区块链上拥有身份、管理资产、自主交易"。这是一个质的飞跃。

ERC-8004 是关键基础设施——如果 Agent 有了链上身份和声誉，那么：
- 用户可以验证 Agent 的历史表现再决定是否信任
- Agent 之间可以基于声誉进行协作
- 恶意 Agent 会被声誉系统淘汰

这比当前"黑盒 Agent + 用户盲信"的模式健康得多。

---

## 下一步行动
1. 深入了解 ERC-8004 规范：https://eips.ethereum.org/EIPS/eip-8004
2. 在学习仓库中创建 `notes/erc-8004-analysis.md`，分析其对 AI×Web3 产品设计的影响
3. 思考：如果给 Hermes Agent 加上链上身份，会带来什么能力？

---

## 证据
- 参与截图：已上传至 WCB（屏幕截图 2026-05-23 190956/191024）
- 逐字稿笔记：本文档
- 学习仓库：https://github.com/tiyadegure/ai-web3-school-cohort-0
