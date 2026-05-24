# 受限 Web3 助手设计：DeFi Swap Guardian

## 1. 解决什么问题

用户想通过自然语言完成链上 token swap，但面临两个极端：
- **太安全：** 每步都要手动签名、确认、查 Etherscan —— 不如直接用 Uniswap UI
- **太危险：** Agent 拿到私钥自动执行 —— 一个 prompt injection 就能清空钱包

**DeFi Swap Guardian** 找中间路线：Agent 负责规划和验证，人负责关键决策，系统负责拦截越界。用户说"帮我用 0.01 ETH 换 USDC"，Agent 自动完成上下文加载、价格查询、交易模拟、风险检查，但在签名前必须让用户看到完整摘要并确认。

---

## 2. 整体架构

```
┌──────────────┐
│   用户输入    │  "用 0.01 ETH 换 USDC，滑点不超过 1%"
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│           Agent 执行层（AI 自动）              │
│                                              │
│  ① 意图解析    → LLM 提取：金额、方向、约束   │
│  ② 上下文加载  → RPC: 余额、allowance、gas   │
│  ③ 价格查询    → DEX API: 路由、报价、滑点    │
│  ④ 交易构建    → encode calldata (未签名)     │
│  ⑤ 交易模拟    → Tenderly dry-run            │
│  ⑥ 风险评估    → Policy engine 检查          │
│  ⑦ 摘要生成    → 人可读的交易说明             │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│         确定性拦截层（Guard）                  │
│                                              │
│  ✅ 目标合约是否在白名单                      │
│  ✅ 金额是否 ≤ 单笔限额                      │
│  ✅ 今日累计是否 ≤ 日限额                     │
│  ✅ 滑点是否 ≤ 用户设定阈值                   │
│  ✅ 是否为无限 approve（拒绝）                │
│  ✅ 接收地址是否为合约自身（拒绝外部转出）     │
│                                              │
│  ❌ 任一检查失败 → 拒绝执行，返回原因         │
└──────────────┬───────────────────────────────┘
               │ 全部通过
               ▼
┌──────────────────────────────────────────────┐
│       ⚠️ 人工确认层（Human-in-the-loop）      │
│                                              │
│  展示给用户：                                 │
│  • 输入：0.01 ETH                            │
│  • 预计输出：~24.5 USDC                      │
│  • 滑点：0.3%（阈值 1%）                     │
│  • Gas：~0.002 ETH                           │
│  • 路由：Uniswap V2                          │
│  • 授权变化：无（已授权）                     │
│  • 失败风险：低                               │
│                                              │
│  → 用户确认 ✅ / 拒绝 ❌                      │
└──────────────┬───────────────────────────────┘
               │ 确认
               ▼
┌──────────────────────────────────────────────┐
│       链上执行层（用户钱包签名）               │
│                                              │
│  🔐 钱包弹窗签名（Agent 不接触私钥）          │
│  ⛓️ 发送至 mempool                           │
│  ⏳ 等待 N 个区块确认                         │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│       结果验证 & 记录                         │
│                                              │
│  • 读取 tx receipt（success / revert）        │
│  • 验证 USDC 余额变化                         │
│  • 记录完整 trace 到日志                      │
│  • 生成可读摘要给用户                         │
└──────────────────────────────────────────────┘
```

---

## 3. 输入和输出示例

### 示例 1：正常 swap

**输入：**
```
用户：帮我用 0.01 ETH 换 USDC，滑点不要超过 1%
```

**输出（摘要，等待确认）：**
```
📋 交易摘要
━━━━━━━━━━━━━━━━━━━━━
操作：Swap ETH → USDC
输入：0.01 ETH
预计输出：24.53 USDC
滑点：0.27%（阈值 1% ✅）
Gas：~0.0018 ETH（约 $4.50）
路由：Uniswap V2
目标合约：0x7a25...（Uniswap Router，白名单 ✅）
授权变化：无（USDC 已授权）
━━━━━━━━━━━━━━━━━━━━━
风险评估：低
• 滑点在阈值内
• 目标合约已验证
• 余额充足
━━━━━━━━━━━━━━━━━━━━━
确认执行？ [确认] [拒绝]
```

### 示例 2：被 Guard 拦截

**输入：**
```
用户：帮我把所有 USDC 转到 0x1234...5678
```

**输出（拒绝）：**
```
❌ 交易被拒绝
━━━━━━━━━━━━━━━━━━━━━
原因：
• 目标地址 0x1234...5678 不在白名单内
• "所有 USDC" 触发全额转出限制
━━━━━━━━━━━━━━━━━━━━━
这个操作超出了我的安全策略。
如需执行，请直接使用钱包操作。
```

### 示例 3：需要额外确认的高风险操作

**输入：**
```
用户：帮我 swap 5 ETH 换 USDC
```

**输出（高风险确认）：**
```
⚠️ 高风险交易
━━━━━━━━━━━━━━━━━━━━━
操作：Swap ETH → USDC
输入：5 ETH（约 $12,500）
⚠️ 金额超过单笔限额（1 ETH）
━━━━━━━━━━━━━━━━━━━━━
此交易需要额外确认。
请确认你理解风险后手动操作。
```

---

## 4. 人工确认点（5 个）

| # | 确认点 | 位置 | 确认方式 |
|---|--------|------|---------|
| H1 | **交易摘要确认** | Agent 生成摘要后、签名前 | 用户看到完整资产变化后决定 |
| H2 | **首次授权确认** | 首次交易某 token 时 | 用户确认授权范围（非无限） |
| H3 | **高金额确认** | 金额超过单笔限额时 | 强制展示影响，要求确认 |
| H4 | **钱包签名** | 每次交易 | 钱包弹窗，用户私钥签名 |
| H5 | **异常恢复确认** | 交易 revert / pending 超时 | 展示状态，用户决定重试或取消 |

---

## 5. 风险和限制（6 个）

### 风险 1：MEV 三明治攻击
- **场景：** Agent 报价后、交易上链前，MEV bot 夹击导致实际滑点远超预期
- **缓解：** 严格滑点阈值 + 使用 Flashbots Protect 或私有 mempool
- **残留风险：** 小额交易通常不被攻击，但大额交易仍有风险

### 风险 2：模拟与实际不一致
- **场景：** Tenderly 模拟通过，但链上状态已变化（其他交易先执行了）
- **缓解：** 模拟时使用最新区块 + 签名前重新查询价格
- **残留风险：** 无法 100% 消除，这是区块链的固有延迟

### 风险 3：Prompt Injection
- **场景：** 恶意 DApp 页面注入指令，让 Agent 生成危险交易
- **缓解：** Guard 层确定性检查 + Agent 不直接解析外部页面内容
- **残留风险：** 新型攻击手段可能绕过 Guard

### 风险 4：RPC 数据不可信
- **场景：** RPC 节点返回错误余额或价格
- **缓解：** 多源验证（2+ RPC 节点交叉检查）
- **残留风险：** 如果所有 RPC 都被攻击（极端情况）

### 风险 5：Session Key 泄露
- **场景：** Agent 持有的 Session Key 被提取
- **缓解：** Session Key 限制严格（金额、时间、目标）+ 用户可随时撤销
- **残留风险：** 在 Session Key 有效期内，攻击者可在限额内操作

### 风险 6：Gas 价格飙升
- **场景：** 交易构建时 gas 正常，发送时 gas 暴涨
- **缓解：** 使用 EIP-1559 的 maxFeePerGas 上限 + 用户确认时展示 gas 估算
- **残留风险：** 极端网络拥堵时交易可能 pending 很久

---

## 6. 如何验证结果

### 链上验证
- **tx receipt：** 确认 status = success（1）或 revert（0）
- **余额变化：** 对比 swap 前后的 token 余额，确认与预期一致
- **区块浏览器：** Etherscan 上可查交易详情，第三方可验证

### 链下验证
- **Trace 日志：** 记录每一步输入/输出/判断/工具调用
- **Regression Set：** 定期跑测试用例，确认 Agent 没有安全退化
- **用户反馈：** 用户确认时看到的摘要应与实际结果一致

---

## 7. Policy 规则清单

```yaml
# DeFi Swap Guardian Policy
version: "1.0"

scope:
  action: "ERC-20 swap only"
  chains: [ethereum, arbitrum, base]
  
limits:
  single_tx_max: 1 ETH
  daily_max: 3 ETH
  daily_count_max: 10
  
allowed:
  contracts:
    - "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"  # Uniswap V2 Router
    - "0xE592427A0AEce92De3Edee1F18E0157C05861564"  # Uniswap V3 Router
  tokens: [ETH, USDC, USDT, DAI, WETH]
  methods: [swapExactETHForTokens, swapExactTokensForETH, approve]
  
denied:
  infinite_approve: true
  external_transfer: true
  unknown_contracts: true
  slippage_above: 3.0  # percent
  
human_check_required:
  - "amount > single_tx_max"
  - "new_token_approval"
  - "slippage > 1.0"
  - "target not in whitelist"
  
guard:
  simulation_required: true
  multi_rpc_verify: true
  max_gas_gwei: 100
  
revocation:
  user_can_revoke_anytime: true
  auto_revoke_on: [daily_limit_hit, consecutive_failures: 3, abnormal_target]
```

---

## 8. 状态机

```
idle
  │ 用户发起请求
  ▼
context_loading    ← 加载余额、价格、gas
  │
  ▼
planning           ← 生成交易计划
  │
  ▼
simulating         ← Tenderly 模拟
  │
  ├── simulation_failed → error_display → idle
  ▼
guard_checking     ← Policy + Guard 检查
  │
  ├── guard_rejected → rejection_display → idle
  ▼
awaiting_human     ← 等待用户确认
  │
  ├── user_rejected → idle
  ▼
signing            ← 钱包签名
  │
  ▼
submitting         ← 发送至 mempool
  │
  ├── tx_failed → error_recovery → awaiting_human
  ▼
confirming         ← 等待区块确认
  │
  ├── reverted → error_recovery → awaiting_human
  ▼
verifying          ← 验证余额变化
  │
  ▼
completed          ← 记录 trace，返回结果
```

---

## 与 Handbook 知识的对应

| 设计元素 | Handbook 来源 |
|---------|--------------|
| 8 步 Task Graph | Agent Workflow → Task Graph |
| 状态机（10 个状态） | Agent Workflow → State Machine |
| 5 个人工确认点 | Agent Workflow → Human-in-the-loop |
| Guard 拦截层 | Agent Wallet → Guard |
| Simulation 预演 | Agent Wallet → Simulation |
| Policy 规则 | Agent Wallet → Policy |
| Trace 记录 | Agent Workflow → Trace |
| Session Key 限额 | Agent Wallet → Session Key |
| Revocation 撤销 | Agent Wallet → Revocation |
| Regression Set | Agent Workflow → Regression Set |
