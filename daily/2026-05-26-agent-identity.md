# Daily Note — Agent Identity 学习笔记

> Handbook 章节：Agent Identity（智能体身份）
> 日期：2026-05-26
> 约 1961 字 | 7 分钟

---

## 核心定义

Agent Identity 不是给 Agent 起个名字，而是让用户、服务和其他 Agent 能验证：它是谁、谁控制它、能提供什么能力、服务入口在哪里、历史记录能不能追溯。

**一句话：** Agent Identity 是把 Agent 从临时会话变成可发现、可验证、可追责的经济参与者。

---

## 第一性原理

- Agent 身份必须绑定控制权、能力声明和服务入口，而不只是一个显示名称
- 身份要可解析：别人能从 identifier 找到 profile 和 endpoint
- 控制权要可证明：更新 profile 或接收付款的人要能证明自己是 owner
- 能力要可验证：能力声明需要测试、证明、评价或历史记录支撑

---

## 知识节点

### ⭐⭐ Agent Profile

Agent 的公开说明文件，包含名称、描述、服务范围、价格、接口、钱包地址、能力列表、模型说明、隐私政策、owner 和版本。

**关键原则：**
- Profile 应该同时给人和机器看（人理解用途，机器解析 endpoint/capabilities/schemas）
- Profile 更新历史本身就是信任信号——换模型、换服务端、换收款地址、增加高风险能力，都不应该静默发生

### ⭐⭐ Capability

描述 Agent 能完成什么任务，以及需要哪些输入和权限。

**关键原则：**
- 越具体越有用：输入类型、输出格式、是否需要钱包权限、是否调用外部 API、最长执行时间、失败如何退款
- 不应该写成"我什么都能做"
- 触发链上动作要标记风险等级：只读分析（低风险）→ 生成交易草稿（中风险）→ 自动执行交易（高风险）

### ⭐ Service Endpoint

外部系统调用 Agent 的入口（HTTPS API / A2A endpoint / MCP server / Webhook / 链上 registry）。

**关键原则：**
- Endpoint 安全性直接影响身份可信度——攻击者劫持 endpoint，用户实际调用的可能是恶意服务
- Endpoint 更新需要 owner 签名，并保留历史
- 要描述支持的协议和版本（A2A / MCP / REST / WebSocket）

### ⭐⭐ Registry

用来登记、发现和更新 Agent 身份。链上 registry 提供公开可查的身份锚点，链下 registry 更灵活但更中心化。

**关键原则：**
- Registry 的价值在于发现和连续性——通过 registry 找到同一个 agentId、owner 和 profile
- Registry 能证明"这个身份是谁注册的"，不能证明"这个 Agent 一定好用或安全"

### ⭐⭐ DID / VC

DID（去中心化标识符）+ VC（可验证凭证）提供通用的去中心化身份和可验证声明模型。

**关键原则：**
- DID 可以表达跨平台身份，VC 可以承载能力证明、组织隶属、审计通过、合规声明
- VC 的可信度取决于 issuer——任何人都能签发声明不等于任何声明都可信
- 产品要展示 issuer、签发时间、撤销状态和验证路径

### ⭐⭐ A2A

Agent 与 Agent 之间如何发现、通信、协商任务和交换结果。

**关键原则：**
- A2A 更像 Agent 的通信层，而不是身份层本身——身份系统告诉你"我在和谁说话"，A2A 负责"怎么协作"
- 支付场景中，A2A 消息最好和 Payment Intent / Receipt / Escrow 状态关联，否则对话和结算会分裂成两套不可对账系统

### ⭐⭐⭐ Ownership

决定谁能更新 Agent profile、收款地址、服务 endpoint 和权限。

**关键原则：**
- Agent owner 可以是 EOA、Smart Account、多签、DAO 或企业账户——高价值 Agent 不应该由单个热钱包控制
- 身份更新、endpoint 更新和收款地址变更都应该留下可验证记录
- 建议把 operator（运行服务）和 owner（控制身份和关键更新）分开
- 涉及责任归属：出了错由谁处理退款、争议和赔偿？

---

## 与 Bridge 知识链的关系

```
Chain-aware Context → Web3 Tool Use → Agent Workflow
      ↓                    ↓                ↓
  数据来源层            执行能力层         流程骨架层
                                          ↓
Agent Wallet → Machine Payment → Settlement & Escrow
      ↓              ↓                  ↓
  权限边界层       支付能力层         交易闭环层
                                          ↓
                              Agent Identity
                                          ↓
                                  身份验证层 ← Trust 的前置条件
```

**核心洞察：** Agent Identity 是 Agent Trust、Machine Payment 和 Agentic Commerce 的前置条件。用户要付款给 Agent，必须知道付款对象是谁；另一个 Agent 要委托任务，也需要验证对方服务入口和历史记录。身份本身不等于可信——它只是信任系统的第一层：先知道对象是谁，再看它做过什么。

---

## 与已有知识的关联

| 已学章节 | 与 Agent Identity 的关系 |
|----------|--------------------------|
| Machine Payment | 付款前必须验证 Agent 身份（付给谁？可信吗？） |
| Settlement & Escrow | 验收和争议需要 Agent 身份作为责任归属依据 |
| Agent Wallet | Agent 的钱包地址是身份的一部分，Ownership 决定谁控制钱包 |
| ERC-8004 | Agent Identity 的链上实现——Identity Registry + Reputation Registry |
| Cobo CAW | Pact 协议隐含了 Agent 身份验证（谁在执行？权限边界是什么？） |

---

## 一句话总结

Agent Identity 的 7 个知识节点形成完整身份栈：Profile（是什么）→ Capability（能做什么）→ Endpoint（怎么调用）→ Registry（怎么发现）→ DID/VC（怎么验证）→ A2A（怎么协作）→ Ownership（谁控制）。身份是信任的起点，不是终点。

---

*学习仓库：https://github.com/tiyadegure/ai-web3-school-cohort-0*
