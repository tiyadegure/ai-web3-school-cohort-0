# Settlement & Escrow（结算与托管）学习笔记

## 章节信息
- **来源：** Handbook AI × Web3 Bridge → 结算与托管（Settlement & Escrow）
- **字数：** 约 2152 字，7 分钟
- **URL：** https://aiweb3.school/zh/handbook/bridge/settlement-and-escrow/

---

## 核心定义

Settlement & Escrow 解决的是 Agent 经济里的"钱什么时候释放、服务怎么算完成、失败怎么退款、争议怎么处理"。

**一句话：** 结算的核心不是"把钱打过去"，而是把任务、交付、验收和付款绑定成可验证流程。

**第一性原理：** 自动化交易必须有明确完成条件，否则支付就无法安全自动化。

---

## 7 个知识节点

### ⭐ Escrow（托管）
把资金锁在合约或可信账户里，等待交付条件满足后再释放。

**最小状态机：** Created → Funded → Delivered → Accepted → Released / Refunded / Disputed

**关键：** 不要把 escrow 只当成"锁钱合约"。如果没有任务描述、交付标准和争议路径，锁钱只会把双方困在合约里。**好的 escrow 先定义业务流程，再定义资金流。**

### ⭐ Receipt（收据）
支付和交付后的凭证。

**不只是"已付款"，应记录：** 谁付给谁、金额、币种、任务 ID、quote id、时间、交易哈希、服务结果引用、验收状态。

**Receipt 是 reputation 的输入：** Agent 是否按时付款、服务方是否按时交付、任务是否被退款，都可以从 receipt 提取。

**同时服务人和机器：** 人能看懂，机器能解析。

### ⭐⭐ Delivery Proof（交付证明）
证明服务方确实交付了某个结果。

**可以是：** 文件 hash、API 返回日志、模型输出签名、链上 event、TEE attestation、人工验收记录。

**要避免"结果存在但不可验证"：** 没有 hash、时间戳、版本信息，后续很难证明交付物是否被替换。

**不同任务需要不同 proof：**
- API 调用 → 请求/响应 hash
- 代码任务 → commit hash + 测试结果
- 数据任务 → dataset hash
- 模型任务 → 模型版本 + 输入/输出 hash

### ⭐⭐ Acceptance（验收）
付款方或规则系统确认"交付满足要求"。

**可以由用户点击确认，也可以由自动 evaluator 判断。** 但高价值任务不要只靠模型一句"看起来完成了"。

**验收应拆成可检查条件：** 字段是否完整、测试是否通过、结果是否在时间内提交、hash 是否匹配、预算是否未超出。

**建议组合：** AI 初审 + challenge window + 人工复核。低风险自动通过，高争议不被模型一次判断决定资金归属。

### ⭐ Refund（退款）
交付失败、超时或取消时把资金退回。

**退款规则要在任务开始前写清楚：** 谁能触发、多久后可以触发、是否扣除部分费用、服务方是否能申诉。

**退款不是失败后的临时善意，而是协议的一部分。**

**要考虑部分交付：** 服务方完成了数据抓取但分析失败，是否按比例付款？

### ⭐⭐⭐ Dispute（争议）
付款方和服务方对交付是否合格的分歧。

**处理方式：** 人工仲裁、多签、DAO、optimistic challenge、第三方 evaluator、链上规则。

**至少要回答：** 谁能发起、发起成本是多少、证据提交格式是什么、谁有裁决权、裁决后是否可申诉。

- 没有成本的争议 → 容易被滥用
- 成本过高 → 小额任务无法维权

**争议记录也是声誉系统的输入：** 频繁进入 dispute 的服务方或客户，都应被后续交易看到。

### ⭐⭐⭐ Evaluator（评估者）
判断交付是否合格的角色或系统。

**可以是：** 脚本、测试套件、模型、人工审核员、多个验证者、链上合约。

**Evaluator 本身也需要被评估：** 错误率很高的 evaluator 会把 escrow 变成随机判决。应记录版本、输入、输出、错误率和历史争议结果。

**建议组合：** 脚本检查格式 → 测试套件检查功能 → AI 检查语义 → 人类处理争议。

### ⭐⭐⭐ ERC-8183（Agentic Commerce 草案）
围绕 agentic commerce 的草案标准，关注任务、支付、escrow、交付和验证如何形成统一流程。

**核心抽象：** Agent 经济里的交易不是单纯 token transfer，而是围绕任务生命周期的状态转换。

**与 ERC-8004 互补：**
- ERC-8004 → Agent 身份、声誉、验证
- ERC-8183 → 任务、支付、托管、交付
- 完整 agent commerce 通常需要两者

---

## 在 AI × Web3 中的位置

Settlement & Escrow 是 Machine Payment 的后半段：
- Machine Payment → "如何付款"
- Settlement & Escrow → "付款后如何确认价值交换完成"

**完整链路：**
```
用户授权预算 → Agent 获取 quote → 检查 policy
    → 资金进入 escrow（锁定）
    → 服务方交付 + Delivery Proof
    → Evaluator 验收 / Dispute 仲裁
    → Release 或 Refund
    → Receipt 记录
```

---

## 与前几章的关联

| 章节 | 关系 |
|------|------|
| Machine Payment | 前半段：报价、付款意图、支付协议 |
| Agent Wallet | Escrow 的资金来源，Policy 控制 escrow 额度 |
| Agent Workflow | 交付→验收→结算 是 workflow 的一部分 |
| Agent Identity | 服务方身份验证、声誉评估 |
| Agent Trust & Reputation | Dispute 记录和 Receipt 是声誉的输入 |

---

## 我的判断

1. **Escrow 状态机是基础。** 先定义业务流程再定义资金流，反过来做一定会出问题。

2. **Evaluator 需要被评估。** 这是递归问题 —— 如果 evaluator 不靠谱，整个 escrow 就是随机判决。组合评估（脚本+测试+AI+人类）比单一模型更可靠。

3. **ERC-8183 的抽象很有价值。** 把 agent commerce 从"发一笔钱"推进到"任务生命周期的状态转换"。这是从 demo 到 production 的关键一步。

4. **与前面所有章节的关系：** Chain-aware Context 提供事实 → Web3 Tool Use 提供能力 → Agent Workflow 提供流程 → Agent Wallet 提供权限 → Machine Payment 提供支付 → **Settlement & Escrow 提供交易闭环。** 这是 Bridge 章节的最后一块拼图。

---

## 学习时长
约 25 分钟（阅读 + 笔记整理）
