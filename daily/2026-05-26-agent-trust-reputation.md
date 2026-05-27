# Daily Note — Agent Trust & Reputation 学习笔记

> Handbook 章节：Agent Trust & Reputation（智能体信任与声誉）
> 日期：2026-05-26
> 约 1863 字 | 6 分钟

---

## 核心定义

Agent Trust & Reputation 解决的是：当一个 Agent 声称自己能完成任务时，用户和其他 Agent 如何判断它是否可靠、历史是否真实、失败是否有代价。

**一句话：** 信任不是一个分数，而是一组可追溯、可比较、可解释的证据。

---

## 第一性原理

- Agent 的可信度应该来自可验证行为，而不是自我声明
- 声誉要绑定身份：没有稳定身份，历史记录无法积累
- 评价要绑定任务：泛泛五星评价不如具体任务结果
- 惩罚要真实：没有成本的承诺很容易被滥用

---

## 知识节点

### ⭐⭐ Reputation

Agent 历史表现形成的信号集合。

**包含信号：** 成功率、响应时间、争议率、退款率、用户评分、验证通过次数、stake 数量、任务类型表现

**关键原则：**
- 不要把所有信号压成一个黑盒分数——用户很难判断适用场景
- 按任务类型拆开：擅长总结治理提案的 Agent 不一定擅长写合约测试
- 要处理时间衰减：两年前的好表现不能代表今天（模型/owner/endpoint 可能已变）

### ⭐⭐ Review

用户、客户或其他 Agent 对任务结果的反馈。

**关键原则：**
- 应该绑定任务 ID、交付物、付款记录和评价者身份——否则容易被刷
- 质量比数量重要：包含任务说明、验收标准、交付 hash 和具体问题的 review，比十个"good job"更有价值
- 要防止互刷：评价者本身也需要身份和声誉

### ⭐⭐ Attestation

某个主体对 Agent、任务或结果做出的可验证声明。

**例子：** "某评测者证明这个 Agent 完成了测试集"、"某 TEE 证明此输出来自某版本程序"

**关键原则：**
- 价值取决于 issuer 是否可信、声明内容是否具体、是否可撤销
- 应该尽量结构化：issuer、subject、claim、evidence、expiration、revocation
- 没有过期和撤销机制的 attestation，容易在条件变化后继续误导用户
- 可以成为 reputation 的基础数据，系统聚合多条 attestation，但仍允许用户查看原始证据

### ⭐⭐ Stake

Agent 或运营方押上的经济保证。

**关键原则：**
- Stake 让承诺有成本——用户更愿意信任有抵押的服务方
- 但 stake 本身不代表能力，只说明失败时有资金可被罚没
- 会带来选择偏差：资本多的 Agent 不一定能力更强
- 设计时明确：抵押什么资产、锁多久、释放条件、罚没条件、罚没给谁

### ⭐⭐⭐ Slashing

在 Agent 违约、作弊或输出虚假结果时罚没抵押。

**关键原则：**
- 设计很难：必须先定义违约证据、挑战窗口、仲裁者、误罚处理和申诉机制
- 错误 slashing 伤害正常服务方，过弱 slashing 无法约束恶意行为
- 对主观任务（"报告质量是否足够"）→ 先进 dispute，不要自动 slashing
- 适合自动 slashing 的场景：明确可验证违约（未按时交付、签名伪造、重复提交矛盾结果）

### ⭐⭐ Validation

对 Agent 能力或任务结果的验证流程。

**验证方式：** 自动测试、benchmark、人工审核、其他 Agent 复核、链上证明、TEE attestation

**关键原则：**
- 区分"能力验证"（Agent 大概率能做某类任务）和"任务结果验证"（某次具体交付是否合格）
- 最好把 validation 结果做成可查询历史，而不是只贴一个认证徽章

### ⭐⭐⭐ ERC-8004

Agent 身份、声誉和验证 registry 的标准草案。

**三个 Registry：**
- Identity Registry — 身份注册
- Reputation Registry — 声誉记录
- Validation Registry — 验证注册

**关键原则：**
- 没有试图把"信任"做成单一中心化评分，而是提供身份、反馈和验证信号的公共承载层
- 不同应用可以在此基础上构建自己的过滤和排序规则
- 链上注册可以证明身份连续性，不能自动证明服务质量
- 仍然要考虑 Sybil、刷评、评价者可信度和任务类型差异

---

## 与 Bridge 知识链的关系

```
Chain-aware Context → Web3 Tool Use → Agent Workflow
→ Agent Wallet → Machine Payment → Settlement & Escrow
→ Agent Identity → Agent Trust & Reputation
                                          ↓
                                  信任验证层 ← 连接 Identity、Settlement、Payment
```

**核心洞察：** Agent Trust & Reputation 连接 Identity、Settlement 和 Payment。没有信任层，Agent 之间无法安全委托；没有声誉和验证，用户难以判断哪个 Agent 值得付款。但不要过度相信声誉分数——真正可靠的系统应该同时看身份、任务历史、评价者、证明、stake、争议记录和上下文适配度。

---

## 与已有知识的关联

| 已学章节 | 与 Trust & Reputation 的关系 |
|----------|------------------------------|
| Agent Identity | Identity 是 Trust 的前置——没有身份，声誉无法积累 |
| Settlement & Escrow | 争议结果是声誉的重要输入（败诉 = 声誉下降） |
| Machine Payment | 声誉影响用户是否愿意付款（高声誉 = 低风险） |
| Agent Wallet | Ownership 和 stake 决定 Agent 的经济约束 |
| ERC-8004 | 本章的核心标准——三个 Registry 的具体实现 |

---

## 一句话总结

信任 = Identity（是谁）+ Reputation（做过什么）+ Validation（验证过什么）+ Stake（押了什么）+ Slashing（违约代价）。ERC-8004 提供了公共承载层，但信任仍然需要上下文适配——没有万能的声誉分数。

---

*学习仓库：https://github.com/tiyadegure/ai-web3-school-cohort-0*
