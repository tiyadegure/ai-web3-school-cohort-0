# AI × Web3 问题地图与主方向选择

> 任务：Week 2｜方向研究｜AI × Web3 问题地图与主方向选择
> 学员：Tiya Degurechaff
> 日期：2026-05-26

---

## 一、问题地图：6 个方向

```
                    ┌─────────────────────────────────────┐
                    │        AI × Web3 问题地图            │
                    └──────────────┬──────────────────────┘
                                   │
        ┌──────────┬───────────┬───┴───┬───────────┬──────────┐
        ▼          ▼           ▼       ▼           ▼          ▼
   Payment/    Identity/   Wallet/  Privacy/   Dev        Governance/
   Commerce   Reputation  Permission Security  Tooling    Coordination
   Settlement  Capability          Sovereignty            Public Goods
```

### 1. Payment / Commerce / Settlement

| 维度 | 说明 |
|------|------|
| **AI 作用** | Agent 自主定价、报价比较、支付决策、交付验收、争议判断 |
| **Web3 机制** | 稳定币支付、智能合约托管（Escrow）、x402 Paywall、Payment Intent、微支付通道 |
| **核心问题** | Agent 如何在预算授权范围内自主完成支付闭环，同时保证可审计和可退款？ |
| **代表协议** | x402、MPP（Machine Payment Protocol）、ERC-8183 |

### 2. Identity / Reputation / Capability

| 维度 | 说明 |
|------|------|
| **AI 作用** | Agent 能力声明、技能评估、历史表现分析、信任度计算 |
| **Web3 机制** | 链上身份注册（Identity Registry）、声誉记录（Reputation Registry）、验证注册（Validation Registry） |
| **核心问题** | Agent 如何证明"我是谁、我能做什么、我做过什么"？用户如何验证 Agent 的可信度？ |
| **代表协议** | ERC-8004、MCP（Model Context Protocol）、A2A（Agent-to-Agent） |

### 3. Wallet / Permission / Safe Execution

| 维度 | 说明 |
|------|------|
| **AI 作用** | Agent 发起交易请求、权限判断、操作范围限制、异常检测 |
| **Web3 机制** | EOA / Smart Account / Multisig、Session Key、ERC-7715 权限委托、PACT 预算限制 |
| **核心问题** | Agent 用什么身份执行链上操作？如何限制 Agent 的操作范围？私钥谁来管？ |
| **代表方案** | Cobo Agentic Wallet（CAW）、Session Key、ERC-7715 |

### 4. Privacy / Security / Sovereignty ⭐ 主方向

| 维度 | 说明 |
|------|------|
| **AI 作用** | 隐私推理（在不暴露输入的情况下完成任务）、安全审计、恶意行为检测、数据最小化 |
| **Web3 机制** | 零知识证明（ZK）、TEE 可信执行环境、Railgun 隐私交易、链上匿名身份、数据主权协议 |
| **核心问题** | Agent 处理敏感数据时如何保证隐私？如何证明执行正确性而不暴露执行过程？用户如何保持对数据的主权？ |
| **代表项目** | Railgun、ZK Passport、TEE Attestation、Semaphore |

### 5. Dev Tooling / Agent Workflow

| 维度 | 说明 |
|------|------|
| **AI 作用** | 代码生成、测试自动化、部署编排、任务图执行、状态机管理、Trace 可观测 |
| **Web3 机制** | 智能合约开发框架（Hardhat/Foundry）、链上验证、MCP 工具连接、可编程执行 |
| **核心问题** | Agent 如何安全地编写、测试和部署智能合约？如何让 Agent 的工作流可验证、可回放？ |
| **代表工具** | Claude Code + Foundry、MCP Server、Task Graph、Evaluation Harness |

### 6. Governance / Coordination / Public Goods

| 维度 | 说明 |
|------|------|
| **AI 作用** | 提案分析、投票建议、资金分配优化、社区治理辅助、公共物品估值 |
| **Web3 机制** | DAO 投票、Quadratic Funding、链上提案、治理代币、Snapshot |
| **核心问题** | Agent 能否代表用户参与治理？如何防止 Agent 被操纵进行恶意投票？AI 辅助治理的边界在哪？ |
| **代表项目** | Gitcoin、Optimism Collective、Snapshot |

---

## 二、深度分析：为什么选择的 2 个方向需要 AI × Web3 交叉？

### 选择 1：Privacy / Security / Sovereignty（主方向）

**为什么不是纯 AI 问题？**
- AI 模型本身不提供隐私保证——LLM 的推理过程对用户不可见，prompt 数据可能被模型提供方记录
- AI 无法自证"我没有泄露你的数据"——需要密码学证明（ZK）或硬件保证（TEE）
- AI 的安全审计需要可信的执行环境，纯软件层面无法防篡改
- 数据主权不能靠 AI 的"承诺"，需要链上权限控制和加密机制

**为什么不是纯 Web3 问题？**
- 链上数据默认公开——需要 AI 来判断哪些数据该公开、哪些该隐藏
- ZK 电路的设计和验证需要 AI 辅助——人工编写 ZK 电路极其复杂
- 隐私策略需要语义理解——"这条交易记录是否包含敏感信息"是 AI 判断问题
- 恶意行为检测需要模式识别——纯规则引擎无法覆盖 AI Agent 的攻击变体

**AI × Web3 交叉点：**
- ZK + AI：用零知识证明验证 AI 推理正确性，不暴露模型参数和用户输入
- TEE + Agent：在可信执行环境中运行 Agent，保证代码完整性
- 链上匿名身份 + AI 风控：用 Semaphore 等匿名协议 + AI 行为分析实现"匿名但可问责"

### 选择 2：Identity / Reputation / Capability

**为什么不是纯 AI 问题？**
- AI 无法自证身份——模型可以声称任何身份，用户无法验证
- AI 的"声誉"不能靠自述——需要第三方验证和链上记录
- Agent 的能力声明可能虚假——需要链上验证机制（如 ERC-8004 Validation Registry）
- 跨平台身份一致性需要去中心化协议，不是单一 AI 系统能解决的

**为什么不是纯 Web3 问题？**
- 链上身份只是地址——不包含 Agent 的能力描述和历史表现
- 声誉数据需要语义分析——"这个 Agent 在 DeFi 场景下的成功率"需要 AI 评估
- 能力匹配需要自然语言理解——用户说"帮我 swap"，需要 AI 判断 Agent 是否具备此能力
- 跨 Agent 协作需要协议理解——MCP/A2A 的能力发现需要 AI 解析

**AI × Web3 交叉点：**
- ERC-8004 + AI：链上注册身份 + AI 能力评估 = 可信的 Agent 发现和匹配
- MCP + 链上验证：工具能力声明 + 链上验证 = 防止虚假能力声明
- 声誉系统 + ML：链上历史数据 + 机器学习 = 动态信任度计算

---

## 三、主方向选择：Privacy / Security / Sovereignty

### 选择理由

1. **学习深度**：5.25 Co-learning 刚学 Railgun 隐私交易，5.27 将参加 Neo-Cypherpunk Privacy 分享，知识链完整
2. **AI × Web3 交叉最密**：隐私是唯一需要同时依赖密码学（ZK/TEE）和 AI（语义判断/异常检测）的方向
3. **产品机会**：当前 Agent 隐私几乎空白——Agent 处理用户数据时没有任何隐私保证
4. **Week 2 主线**：围绕隐私安全展开后续任务——最小支付流程（隐私支付）、Agent Profile（隐私声明）、Proposal（隐私 Agent 框架）

### 知识链位置

```
Chain-aware Context → Web3 Tool Use → Agent Workflow
      ↓                    ↓                ↓
  数据来源层            执行能力层         流程骨架层
                                          ↓
Agent Wallet → Machine Payment → Settlement & Escrow
      ↓              ↓                  ↓
  权限边界层       支付能力层         交易闭环层
                                          ↓
                              Privacy / Security / Sovereignty
                                          ↓
                                  隐私保证层 ← 所有层都需要
```

**核心洞察：** 隐私不是某个环节的附加功能，而是贯穿 Agent 全生命周期的基础设施。Chain-aware Context 需要隐私（链上数据读取可能暴露用户意图）、Agent Wallet 需要隐私（交易签名暴露身份）、Payment 需要隐私（支付金额和接收方可能敏感）、Settlement 需要隐私（交付内容可能包含商业机密）。

---

## 四、下一步行动

1. **5.27 参加 Neo-Cypherpunk Privacy 分享** — 补充隐私文化层理解
2. **Week 2 最小支付任务** — 设计隐私支付流程（Railgun + Agent Payment）
3. **Agent Profile 任务** — 设计包含隐私声明的 Agent Profile
4. **Proposal 初稿** — 隐私 Agent 框架：ZK + TEE + ERC-8004 的组合方案

---

*学习仓库：https://github.com/tiyadegure/ai-web3-school-cohort-0*
