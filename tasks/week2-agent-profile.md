# Agent Profile 与能力声明草图

> 任务：Week 2｜Agent Identity｜Agent Profile 与能力声明草图
> 学员：Tiya Degurechaff
> 日期：2026-05-26

---

## 一、Agent 选择：Privacy Analytics Agent

**为什么选这个 Agent？**
- 与 Week 2 主方向（Privacy / Security / Sovereignty）直接对应
- 与上一个任务（最小支付流程）形成完整的"Agent 画像 + 商业流程"闭环
- 涉及隐私保护、TEE、链上数据——AI × Web3 交叉最密的场景

---

## 二、Agent Profile 草图

### 1. 它是谁（Identity）

```
┌─────────────────────────────────────────────────────────┐
│  Agent Profile: Privacy Analytics Agent                  │
│  ID: paa-001                                             │
│  Version: 0.1.0                                          │
│  Chain: Ethereum / Base / Arbitrum                       │
│  Contract: 0x...TBD                                      │
└─────────────────────────────────────────────────────────┘
```

**名称：** Privacy Analytics Agent (PAA)

**一句话描述：** 在 TEE 环境中分析用户链上数据，全程数据不泄露，结果可验证。

**类比：** 如果说 Chain-aware Context 是"Agent 能看见什么"，那 PAA 是"Agent 能帮你看清什么，同时不告诉任何人"。

### 2. 由谁维护（Maintainer）

| 角色 | 身份 | 职责 |
|------|------|------|
| **开发者** | Tiya Degurechaff | Agent 逻辑、分析算法、TEE 部署 |
| **运维者** | 同上（初期单人） | 监控、升级、故障处理 |
| **审计者** | 社区 / 第三方安全团队 | TEE 代码审计、Attestation 验证 |
| **用户** | 链上用户 / DeFi 玩家 | 使用服务、提供反馈、报告问题 |

**维护模式：**
- 初期：单人开发+运维，开源代码
- 中期：引入社区贡献者，建立 DAO 治理
- 长期：去中心化运营，多 Agent 竞争

### 3. 能做什么（Capability）

**核心能力：**

| 能力 | 输入 | 输出 | 隐私级别 |
|------|------|------|----------|
| **DeFi 收益分析** | 用户地址、时间范围 | 收益明细、收益率、来源 | TEE |
| **Gas 消耗分析** | 用户地址、时间范围 | Gas 统计、优化建议 | TEE |
| **风险暴露分析** | 用户地址 | 协议风险、集中度风险 | TEE |
| **交易模式识别** | 用户地址、时间范围 | 交易习惯、异常检测 | TEE |
| **税务报告生成** | 用户地址、时间范围、税务辖区 | 税务报告（CSV/PDF） | TEE |

**能力边界（不能做什么）：**
- ❌ 不能访问用户私钥或钱包控制权
- ❌ 不能执行交易（只分析，不操作）
- ❌ 不能保证分析结果的投资建议准确性
- ❌ 不能分析非 EVM 链的数据（初期）
- ❌ 不能处理超过 10,000 笔交易的大数据集（初期限制）

**能力声明格式（MCP 风格）：**

```json
{
  "name": "privacy-analytics-agent",
  "description": "在 TEE 环境中分析链上数据，全程隐私保护",
  "capabilities": [
    {
      "name": "analyze_defi_yield",
      "description": "分析 DeFi 收益，包括 LP、借贷、Staking",
      "input": {
        "address": "string (0x...)",
        "chain": "string (ethereum/base/arbitrum)",
        "timeRange": "string (7d/30d/90d)"
      },
      "output": {
        "totalYield": "number (USDC)",
        "yieldByProtocol": "object",
        "riskScore": "number (0-100)"
      },
      "privacy": "TEE",
      "price": "3 USDC",
      "estimatedTime": "2 min"
    }
  ]
}
```

### 4. 如何被调用（Invocation）

**调用方式：**

```
方式 1: HTTP API + x402
  POST /api/analyze
  Header: X-402-Payment: <payment-proof>
  Body: {"address": "0x...", "chain": "ethereum", "timeRange": "30d"}

方式 2: MCP Tool Call
  Agent → PAA: tool_call("analyze_defi_yield", {
    address: "0x...", chain: "ethereum", timeRange: "30d"
  })

方式 3: A2A 协作
  User Agent → PAA: Agent-to-Agent message with task specification
```

**调用流程：**
1. 用户（或用户 Agent）发起请求
2. PAA 返回报价 + 隐私保证声明
3. 用户授权预算（Session Key / x402 支付）
4. PAA 在 TEE 中执行分析
5. 返回结果 + TEE Attestation
6. 用户验证 Attestation，确认结果

### 5. 如何收费（Pricing）

**定价模型：按次付费 + 复杂度加价**

| 服务 | 基础价 | 加价因素 |
|------|--------|----------|
| DeFi 收益分析 | 3 USDC | 每增加 1000 笔交易 +0.5 USDC |
| Gas 消耗分析 | 2 USDC | 跨链分析 +1 USDC/链 |
| 风险暴露分析 | 5 USDC | 包含协议风险评估 +2 USDC |
| 税务报告生成 | 10 USDC | 多辖区 +5 USDC/辖区 |

**收费机制：**
- 预授权：用户通过 Session Key 授权预算上限
- 后结算：分析完成后，按实际计算量结算
- 退款：执行失败或超时全额退款

**收入分配：**
- 70% → Agent 运营者（计算成本 + 维护）
- 20% → TEE 基础设施提供者
- 10% → 社区基金（审计、开发、治理）

### 6. 如何被验证（Verification）

**验证维度：**

| 维度 | 验证方式 | 验证者 |
|------|----------|--------|
| **身份验证** | ERC-8004 Identity Registry 链上注册 | 任何人 |
| **代码验证** | TEE Attestation（代码哈希可验证） | 用户 / 审计者 |
| **执行验证** | TEE Attestation（证明在安全环境中执行） | 用户 |
| **结果验证** | 结果哈希上链 + 与链上数据交叉验证 | 用户 / 第三方 |
| **声誉验证** | ERC-8004 Reputation Registry 历史记录 | 任何人 |

**验证流程：**
```
1. 用户查询 Agent 的 ERC-8004 身份记录
   → 确认 Agent 是注册的、有历史的

2. 用户查看 Agent 的声誉评分
   → 成功率、平均评分、投诉记录

3. 执行后，用户验证 TEE Attestation
   → 确认代码未被篡改、数据未泄露

4. 用户交叉验证结果
   → 用 Etherscan 等工具抽查部分数据
```

### 7. 失败如何处理（Failure Handling）

**失败类型与处理：**

| 失败类型 | 原因 | 处理方式 | 用户影响 |
|----------|------|----------|----------|
| **超时** | 数据量过大 / TEE 资源不足 | 自动退款 + 通知用户 | 全额退款 |
| **Attestation 失败** | TEE 环境异常 | 终止执行 + 全额退款 | 全额退款 |
| **数据不可用** | RPC 节点故障 / 数据未索引 | 重试 3 次 → 失败退款 | 全额退款 |
| **结果不准确** | 分析算法 bug | Challenge Window → 人工审核 | 可能退款 |
| **隐私泄露** | TEE 漏洞 / 侧信道攻击 | 紧急暂停 + 审计 + 赔偿 | 全额退款 + 赔偿 |

**降级策略：**
- TEE 不可用 → 切换到备用 TEE 节点
- 主链 RPC 故障 → 切换到备用 RPC
- 分析超时 → 拆分为子任务并行执行

**声誉影响：**
- 成功完成 → 声誉 +1
- 主动退款（非 Agent 过错）→ 声誉不变
- 被动退款（Agent 过错）→ 声誉 -1
- 争议裁决 Agent 败诉 → 声誉 -3

---

## 三、协议对比加分：ERC-8004 vs MCP

### ERC-8004 解决哪类问题？

**解决：Agent 身份与声誉的链上注册和验证**

- **机制：** 三个 Registry——Identity Registry（身份注册）、Reputation Registry（声誉记录）、Validation Registry（验证注册）
- **解决的问题：** "这个 Agent 是谁？它做过什么？它可信吗？"
- **适用场景：** 用户需要验证 Agent 身份、查看历史表现、做出信任决策
- **在本 Agent 中的位置：** PAA 在 ERC-8004 注册身份，用户通过 Identity Registry 验证"这个 Agent 是合法的"，通过 Reputation Registry 查看"这个 Agent 的历史成功率"
- **局限：** 不解决 Agent 之间的协作协议和接口规范

### MCP 解决哪类问题？

**解决：Agent 与工具之间的标准化连接和能力发现**

- **机制：** 标准化的 Tool 描述格式（name、description、input schema、output schema）+ 运行时能力发现
- **解决的问题：** "Agent 如何发现和调用外部工具？工具的能力如何声明？"
- **适用场景：** Agent 需要调用外部服务、工具需要被 Agent 发现和使用
- **在本 Agent 中的位置：** PAA 通过 MCP 声明自己的能力（analyze_defi_yield 等），其他 Agent 通过 MCP 发现和调用 PAA
- **局限：** 不解决身份验证和声誉问题——MCP 只管"怎么调用"，不管"能不能信任"

### 两者互补关系

```
ERC-8004                    MCP
  │                          │
  │  "你是谁"                │  "你能做什么"
  │  "你做过什么"            │  "怎么调用你"
  │  "你能信任吗"            │  "输入输出格式"
  │                          │
  ▼                          ▼
身份与声誉层 ←────────────→ 能力与接口层
```

**组合使用：**
- 用户通过 **ERC-8004** 验证 PAA 的身份和声誉（"这个 Agent 可信吗？"）
- 用户通过 **MCP** 发现 PAA 的能力并调用（"它能做什么？怎么用？"）
- 完成后，执行结果记录到 **ERC-8004 Reputation Registry**（"这次服务成功了吗？"）

**完整流程：**
```
1. 用户查询 PAA 的 ERC-8004 身份 → 确认合法
2. 用户查看 PAA 的声誉评分 → 确认可信
3. 用户通过 MCP 发现 PAA 的能力 → 确认满足需求
4. 用户调用 PAA 的 MCP 工具 → 完成分析
5. 分析结果记录到 ERC-8004 声誉 → 建立长期信任
```

---

## 四、Agent Profile 总结

```
┌─────────────────────────────────────────────────────────────┐
│  Privacy Analytics Agent (PAA) - Agent Profile Summary      │
├─────────────────────────────────────────────────────────────┤
│  身份: paa-001, v0.1.0                                      │
│  维护: Tiya Degurechaff (初期单人, 长期 DAO)                 │
│  能力: 链上数据分析 (DeFi/Gas/Risk/Tax), TEE 隐私保护       │
│  调用: HTTP+x402 / MCP Tool / A2A                           │
│  收费: 按次付费 (2-15 USDC), 预授权+后结算                   │
│  验证: ERC-8004 身份+声誉 + TEE Attestation                 │
│  失败: 自动退款 + 声誉影响 + 降级策略                        │
│  隐私: TEE 飞地执行, 数据不泄露, Attestation 可验证          │
├─────────────────────────────────────────────────────────────┤
│  协议栈: ERC-8004 (身份声誉) + MCP (能力发现) + x402 (支付)  │
│  主方向: Privacy / Security / Sovereignty                    │
└─────────────────────────────────────────────────────────────┘
```

---

*学习仓库：https://github.com/tiyadegure/ai-web3-school-cohort-0*
