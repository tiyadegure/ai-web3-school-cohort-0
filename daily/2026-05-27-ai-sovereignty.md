# Daily Note — AI Sovereignty 学习笔记

> Handbook 章节：AI Sovereignty（AI 主权）
> 日期：2026-05-27 (UTC+8)
> 约 2388 字 | 8 分钟

---

## 核心定义

AI Sovereignty 讨论的是用户、开发者和社区能否控制自己的数据、模型选择、记忆、工具权限和执行环境，而不是被单一平台锁定。

**一句话：** AI 主权让用户保留退出、迁移、选择和验证的能力。

---

## 第一性原理

越靠近用户决策和资产的 AI，越不能只依赖平台承诺。

- 控制权要在用户侧可见：用户知道哪些数据、权限和记忆被使用
- 选择权要真实存在：模型、钱包、工具和存储不应被单点锁死
- 可验证性要保底：关键行为要有日志、签名、证明或链上记录

---

## 知识节点

### ⭐⭐ User Control

用户能查看、修改、撤销 AI 代理的权限和数据使用。

**控制面板至少要显示：** 连接的钱包、session key、授权额度、启用的工具、记忆开关、数据导出入口、紧急停止按钮

**关键原则：** 不要把这些藏在高级设置里——用户看不见就谈不上控制权

### ⭐⭐ Data Portability

让用户可以把偏好、记忆、任务历史和凭证带走。

**关键原则：**
- 不能导出的记忆就是锁定
- 分层导出：任务历史、用户偏好、工具日志、身份凭证、可公开声誉、私有记忆（标明敏感等级）
- 给另一个 Agent 使用时，提供机器可读格式（JSON schema / VC / 签名日志 / profile 文件）

### ⭐⭐ Model Choice

用户或开发者可以根据任务选择不同模型。

**关键原则：**
- 策略化选择：隐私优先 / 成本优先 / 质量优先 / 开源优先 / 可验证优先
- 用户设默认偏好，Agent 执行前解释为什么选择某个模型
- 高风险 Agent 不能随便热切换模型后继续自动执行

### ⭐⭐ Local-first AI

优先在本地处理敏感数据，必要时才调用云端模型。

**Vitalik 观点：** AI 可能把界面从"点击和输入"推向"说出目标，让 bot 完成"。这让本地优先更重要——如果钱包、身份和资产操作都经过 AI，用户设备就需要承担更多数据保护和主动防御能力。

**混合架构：** 本地模型做过滤/脱敏/风险初筛 → 云端强模型只接收必要摘要 → 最终交易由钱包或智能账户确认

### ⭐⭐⭐ Censorship Resistance

AI 服务、模型、数据和 Agent 身份是否会被单点封锁或删除。

**AI 审查的表现形式：**
- 模型拒绝某类合法任务
- 平台下架某个 Agent
- API 封禁某个地区
- 训练数据过滤某些观点

**抗审查设计：** 开源客户端、多模型 fallback、可自托管 endpoint、可迁移身份、去中心化存储、链上/签名审计记录

### ⭐⭐⭐ d/acc（Defensive Accelerism）

加速防御性、去中心化和人类增强技术。

**Vitalik 框架：** 技术乐观但重视防御、民主、去中心化和差异化发展

**在 AI × Web3 中的含义：** 不只做"更强的自动代理"，还要做"更好的防御工具"：
- 更安全的钱包
- 抗钓鱼界面
- 可验证 Agent 日志
- 隐私保护数据协作
- 开源模型评测
- 去中心化身份和声誉

### ⭐⭐⭐ CROPS

Ethereum 应守住的核心属性，作为 AI × Web3 产品价值检查表：

| 属性 | 含义 |
|------|------|
| **C**ensorship resistance | Agent 身份、工具入口、数据来源是否过度依赖单一平台 |
| **O**pen source | 关键客户端、合约、策略、评估集是否可检查 |
| **P**rivacy | 用户数据、钱包历史、记忆是否被最小化和隔离 |
| **S**ecurity | 钱包、权限、session key、工具调用是否有明确防线 |

**与 d/acc 的关系：** 相通的——不是反对 AI，而是要求 AI 进入钱包/治理/身份/支付层时，不能牺牲用户控制、隐私和安全

---

## 与 Bridge 知识链的关系

```
Chain-aware Context → Web3 Tool Use → Agent Workflow
→ Agent Wallet → Machine Payment → Settlement & Escrow
→ Agent Identity → Agent Trust & Reputation
→ AI Oracle → Verifiable AI → AI Security → AI Privacy → AI Sovereignty
                                                                          ↓
                                                                  整个路线的价值底层
```

**核心洞察：** 没有主权设计，AI × Web3 很容易变成"用链上资产喂给更中心化的 AI 平台"。

---

## 与已有知识的关联

| 已学章节 | 与 AI Sovereignty 的关系 |
|----------|-------------------------|
| Agent Wallet | 用户控制权限的基础（session key / 紧急停止） |
| Agent Identity | 可迁移身份 = 主权的一部分 |
| AI Privacy | 数据边界和最小披露是主权的具体实践 |
| Verifiable AI | 可验证性是主权的保底（审计日志/链上记录） |
| AI Security | 权限隔离和 Sandbox 是防御性设计 |
| 主方向 Privacy | Sovereignty 是 Privacy 的上层建筑 |

---

## 一句话总结

AI Sovereignty = User Control（控制权可见）+ Data Portability（数据可迁移）+ Model Choice（模型可选择）+ Local-first AI（本地优先）+ Censorship Resistance（抗审查）+ d/acc（防御性加速）+ CROPS（价值检查表）。核心：让用户保留退出、迁移、选择和验证的能力。

---

*学习仓库：https://github.com/tiyadegure/ai-web3-school-cohort-0*
