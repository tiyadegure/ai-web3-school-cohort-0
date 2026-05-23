# Open Agentic Economy — 会议记录

> 主讲：Sophia（Ethereum Foundation, Developer Acceleration 团队）
> 时间：2026-05-23 09:30 UTC+8
> 来源：会议逐字稿（中英对照）

## 核心论点

**Ethereum for AI = Ethereum for Humans**

AI agents 正在从"查询工具"变成"经济参与者"——写代码、转移资金、做决策、协商、雇佣其他 agents。它们需要基础设施来交易、协商和支付，而这个基础设施将塑造整个新经济的运行方式。

## 为什么现在讨论

1. **AI agents 指数级增长** — 18 个月前还是聊天机器人，现在已是经济参与者
2. **ERC-8004 上线**（2026 年 1 月）— 给 agents 提供可验证身份和声誉
3. **Agent 不能用人类基础设施** — 密码存 context window、不能开银行账户、不能签法律合同、不能建立信誉

## CROPS 框架 — Ethereum 的设计原则

| 原则 | 含义 | 对 Agent 的意义 |
|------|------|----------------|
| **C**ensorship resistance | 无单一参与者能阻止有效交易 | Agent 的合约执行不被审查 |
| **R** Open source & free | 代码开放，可审计、fork、构建 | Agent 可以用乐高积木式组合 |
| **O** Ownership | 数字资产无需中介拥有 | Agent 可以持有和管理资产 |
| **P** Privacy | 零知识证明，证明事实不暴露数据 | Agent 交易可保护隐私 |
| **S** Security | 网络安全保障 | Agent 资金和操作安全 |

## ERC-8004 — Agent 身份与信任

三个组成部分：
1. **Verification（验证）** — 验证 agent 的身份
2. **Registry（注册表）** — agent 的链上注册
3. **Reputation（声誉）** — agent 本身的声誉评分（不是 owner 的）

扩展性：不只 agents，API、oracles、任何需要声誉的数字对象都可以用 8004。

路线图：TEE 验证 + 扩展私密支付 + agent-合约自动协商 + AI 框架集成

## x402 — 机器对机器支付

HTTP 402 Payment Required 状态码 → 稳定币支付 → agent 直接完成支付

## 真实案例：EF 公共物品资金分配

Ethereum Foundation 试点：AI agents 帮助分配公共物品资金（数十万美元 → 数百个 GitHub 仓库）
- 人类做决策，agents 帮助扩大判断规模
- 人类设计 agents 应该重视什么、不重视什么
- 持续迭代调整规则

## 最大应用领域：支付

Sophia 的判断：**支付是 AI × agentic economy 最大的应用领域**

例子：
- ❌ 人类方式："Agent，去买披萨，这是我的信用卡" → agent 可能被 prompt injection 操控
- ✅ 链上方式："Agent，这是只有 10 美元的钱包 + 智能合约，只能在这个商家花" → 有规则保障

**可编程货币 = 给 agent 的支付设规则**

## Q&A 关键问答

**Q: Agentic commerce 的下一个突破？**
A: 大型企业支付。Stripe、Bridge、Visa 都在做 AI-powered payments。

**Q: ERC-8004 的 reputation 是 agent 的还是 owner 的？**
A: 是 agent 本身的（数字软件实体），可以扩展到 API、oracles 等。

**Q: 链上 agent activity 增长慢怎么解释？**
A: 协议还不能覆盖所有 job，需要 builders 在应用层做更多定制。

**Q: 给新人的建议？**
A: 看 ETH Skills——一个 skill file，发给 agent 让它了解 Ethereum 生态。
