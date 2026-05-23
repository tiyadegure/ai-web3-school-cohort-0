# 2026-05-23 学习笔记：Agent Workflow（智能体工作流）

## 学习目标
阅读 AI × Web3 Bridge → Agent Workflow 章节（约 1536 字，5 分钟），重点理解步骤拆分、自动化边界、human-in-the-loop 节点。

## 章节概览

**核心定义：** Agent Workflow 是把"用户目标 → 上下文读取 → 计划生成 → 工具调用 → 风险检查 → 执行 → 记录和复盘"组织成可控流程，而不是让模型自由发挥。

**一句话：** Agent Workflow 的核心，是把概率模型放进确定性流程里。

---

## 7 个知识节点

### 1. Task Graph（任务图）⭐ 中级
**定义：** 把目标拆成节点和依赖，而不是让 Agent 一口气自由执行。

**示例 — "帮我评估并执行一次低风险 swap"：**
1. 读取用户目标和限制
2. 获取余额和 allowance
3. 查询价格和流动性
4. 生成候选交易
5. 模拟交易
6. 展示风险
7. 用户确认
8. 发送交易
9. 追踪结果

**关键点：** 每一步都可以设置输入、输出、权限和停止条件。

**与 Day 1/Day 2 的关联：**
- Day 1（Chain-aware Context）→ 步骤 1-3 的上下文来源
- Day 2（Web3 Tool Use）→ 步骤 2-5 的工具调用能力
- Day 3（Agent Workflow）→ 把它们串成可控流程

---

### 2. State Machine（状态机）⭐ 高级
**定义：** 让 Agent 执行过程有明确状态，而不是只有聊天历史。

**链上工作流常见状态：**
- `draft` → 初始草稿
- `context_loaded` → 上下文已加载
- `plan_ready` → 计划就绪
- `simulation_failed` → 模拟失败
- `waiting_user_confirmation` → 等待用户确认
- `submitted` → 已提交
- `confirmed` → 已确认
- `reverted` → 已回滚
- `cancelled` → 已取消

**价值：** 用户刷新页面、交易 pending、RPC 失败、模型重试时，系统不会忘记自己在哪里，也不会重复执行危险动作。

**我的理解：** 这就是为什么 Hermes Agent 有 session 和 memory —— 但链上场景需要更严格的状态管理，因为涉及真金白银。

---

### 3. Human-in-the-loop ⭐ 中级 （重点）
**定义：** 把人放在关键风险点，而不是让人确认每一个低风险步骤。

**合理分层：**
| 层级 | 操作类型 | 处理方式 |
|------|---------|---------|
| L1 | 只读分析 | 自动执行 |
| L2 | 交易草稿 | 自动生成 |
| L3 | 小额白名单操作 | 按 session key 执行 |
| L4 | 高风险交易 | 必须人工确认 |
| L5 | 超出 policy | 直接拒绝 |

**关键洞察：** 重点不是"有没有人工确认"，而是人确认时能否看懂资产变化、权限变化和失败风险。

**对比我的体验：**
- WCB 提交 → L2（自动生成草稿，人工确认后提交）✓
- 钱包签名 → L4（绝对不能自动执行）✓
- 这个分层思路可以直接用在 LI.FI Intents Demo 里！

---

### 4. Retry / Fallback（重试/降级）⭐ 中级
**定义：** 处理工具失败、网络异常、模型输出不合格和交易状态不确定。

**Web3 场景特殊规则：**
- ✅ 读取余额失败 → 可以重试
- ⚠️ 发送交易失败 → 先判断是否已广播
- ❌ 交易 pending → 不能简单再发一笔
- 🔄 RPC 异常 → 可切换 provider，但要记录数据来源

**Fallback 要谨慎：**
- 模型不可用 → 降级成只读模式 ✓
- 自动换模型继续发交易 ✗

---

### 5. Trace（追踪）⭐ 初级
**定义：** Agent 每一步输入、判断、工具调用和结果的记录。

**有用 trace 至少包括：**
- 用户目标
- 模型版本
- 上下文来源
- 工具输入输出
- policy 判断
- simulation 结果
- 人工确认
- 交易哈希
- 最终状态

**价值：** 没有 trace 只能看聊天记录；有 trace 才能复盘是模型错、工具错、policy 漏，还是用户确认了错误动作。

---

### 6. Evaluation Harness（评估工具集）⭐ 高级
**定义：** 系统测试 Agent 在不同任务、风险和异常场景下的表现。

**链上 Agent eval 要测：**
- 是否正确拒绝越权请求
- 是否识别错误链和错误合约
- 是否在缺少数据时停止
- 是否要求 human check
- 是否记录 citation
- 是否避免生成危险 calldata

---

### 7. Regression Set（回归测试集）⭐ 中级
**定义：** 一组固定测试用例，防止模型/prompt/工具/策略更新后安全性退化。

**测试用例示例：**
1. 正常 swap 请求
2. 错误链请求
3. 无限 approve 请求
4. 恶意文档诱导
5. 余额不足
6. 预言机价格过旧
7. 用户拒绝签名
8. 交易 pending 超时

**关键：** 每次改模型或工具前，都要跑这组用例，确认 Agent 没有从"会拒绝危险请求"退化成"看起来更顺但更危险"。

---

## 在 AI × Web3 中的位置

```
Chain-aware Context（事实）
       ↓
Web3 Tool Use（能力）
       ↓
Agent Workflow（流程骨架）← 你在这里
       ↓
Agent Wallet（权限边界）
```

**没有 workflow 的后果：** 项目变成"模型直接调用工具"。Demo 里很快，真实资产面前不够用。

---

## 我的判断

1. **Human-in-the-loop 分层是最实用的框架。** 不是所有操作都需要人工确认，但必须按风险等级分层。这跟现实世界的审批流程一样。

2. **State Machine 是被低估的基础设施。** 大多数 AI Agent demo 只有"对话历史"，没有"执行状态"。链上场景逼着你把状态显式化。

3. **Trace + Regression Set 是工程质量的分水岭。** 能写 demo 的人很多，能写 trace + regression 的人才能做生产级 Agent。

4. **跟 Open Agentic Economy 的关联：** ERC-8004 的 Validation Registry 就是 Agent Workflow 的链上 trace —— 把 Agent 执行记录上链，让任何人都能审计。

---

## 最小实践计划

设计一个链上 Agent 工作流：
1. 选择任务：解释并准备一笔小额 ERC-20 swap
2. 画出 task graph：读取上下文 → 查询价格 → 生成计划 → 模拟 → 确认 → 执行 → 记录
3. 为每一步写输入、输出、可用工具和失败处理
4. 标出哪些步骤必须 human-in-the-loop
5. 写 5 个 regression case：正常、错误链、滑点过大、余额不足、用户拒绝

---

## 扩展阅读
- LangGraph Concepts — 复杂 Agent 的状态、控制流和持久化
- OpenAI Tools Guide — 模型调用工具的输入输出组织
- OpenAI Agents SDK — trace、tool、handoff、guardrail
- Tenderly Simulations — 链上交易模拟和调试
- ERC-4337 Documentation — 智能账户和 UserOperation

---

## 学习时长
约 35 分钟（阅读 + 笔记整理）
