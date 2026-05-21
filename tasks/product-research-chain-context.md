# 产品调研：链感知上下文（Chain-aware Context）

> 调研时间：2026-05-21
> 调研视角：AI × Web3 产品构建者
> 核心问题：现有产品如何让 AI 模型"看见"链上数据？

---

## 目录

1. [背景与核心问题](#1-背景与核心问题)
2. [产品对比总览](#2-产品对比总览)
3. [产品详细分析](#3-产品详细分析)
   - 3.1 [Tenderly](#31-tenderly)
   - 3.2 [Blocknative](#32-blocknative)
   - 3.3 [Blowfish](#33-blowfish)
   - 3.4 [Pocket Universe](#34-pocket-universe)
   - 3.5 [ScamSniffer](#35-scamsniffer)
   - 3.6 [ChainGPT](#36-chaingpt)
   - 3.7 [Moralis](#37-moralis)
   - 3.8 [The Graph](#38-the-graph)
   - 3.9 [Phantom Wallet](#39-phantom-wallet)
   - 3.10 [MetaMask Snaps](#310-metamask-snaps)
4. [对比分析](#4-对比分析)
5. [关键洞察](#5-关键洞察)
6. [对构建者的建议](#6-对构建者的建议)

---

## 1. 背景与核心问题

链感知上下文（Chain-aware Context）是指将链上可验证数据结构化后，作为 AI 模型的输入上下文。核心挑战：

- **模型无法从记忆中判断链上事实**：链上状态是动态的，模型训练数据有截止日期
- **链状态具有时效性**：余额、授权、价格每一秒都在变化
- **上下文必须有来源**：每条数据都应可追溯到链上交易或区块
- **区分事实与解释**：链上数据是客观事实，AI 的分析是主观解释

---

## 2. 产品对比总览

| 产品 | 类别 | 上下文包组件 | 引用机制 | 事实/解释区分 | 实时/索引 |
|------|------|-------------|---------|--------------|----------|
| Tenderly | 交易模拟器 | trace, logs, balance changes, gas | tx hash, explorer link | ✅ 明确区分 | 实时模拟 |
| Blocknative | 交易监控 | mempool data, tx status, gas | tx hash | ⚠️ 部分区分 | 实时 |
| Blowfish | 钱包安全 | tx simulation, state changes, risk score | tx hash | ✅ 明确区分 | 实时模拟 |
| Pocket Universe | 钱包安全 | tx preview, token approvals, risk | tx hash | ✅ 明确区分 | 实时 |
| ScamSniffer | 钱包安全 | address reputation, scam database | address, tx hash | ✅ 明确区分 | 索引+实时 |
| ChainGPT | AI Agent | chain state, contract info | contract address | ❌ 混合 | 混合 |
| Moralis | 数据基础设施 | API responses, indexed data | API endpoint | ⚠️ 部分区分 | 索引 |
| The Graph | 索引协议 | subgraph data, events | subgraph id | ⚠️ 部分区分 | 索引 |
| Phantom | 钱包 | tx preview, token info | tx hash | ✅ 明确区分 | 实时 |
| MetaMask Snaps | 钱包扩展 | 自定义上下文 | tx hash | ⚠️ 依赖实现 | 实时 |

---

## 3. 产品详细分析

### 3.1 Tenderly

**URL**: https://tenderly.co  
**类别**: 交易模拟器 / 开发者工具

#### 上下文包组件
- **交易 Trace**：完整的调用栈，包括嵌套调用
- **Logs/Events**：所有 emitted events，已解码
- **Balance Changes**：资产变化，包括美元价值
- **Gas 估算**：精确的 gas 使用量和成本
- **State Changes**：存储槽变化
- **Asset Changes**：代币转移详情

#### 引用机制
- 提供 `simulation_id` 作为唯一标识
- 生成 Tenderly Dashboard 链接，可直接查看模拟结果
- 支持 tx hash 链接到区块浏览器
- API 响应包含完整的链元数据（chain_id, block_number）

#### 事实 vs 解释
- ✅ **明确区分**：模拟结果（trace, logs, balance changes）是客观数据
- ✅ AI 解释层与数据层分离
- ✅ 用户可直接验证原始数据

#### 实时 vs 索引
- **实时模拟**：在虚拟环境中执行，镜像真实链状态
- **支持 state overrides**：可修改链上条件进行测试
- **104+ 支持的网络**

#### 优势
- 🟢 最完整的上下文包：trace + logs + balance + gas
- 🟢 100% 准确的 gas 估算
- 🟢 支持 bundled transactions（治理提案模拟）
- 🟢 清晰的数据层级结构

#### 劣势
- 🔴 需要 API 调用，非零延迟
- 🔴 模拟结果不等于实际执行结果（链状态可能变化）
- 🔴 未解码合约需要 ABI

---

### 3.2 Blocknative

**URL**: https://www.blocknative.com  
**类别**: 交易监控 / Mempool 数据（已被 Deloitte 收购）

#### 上下文包组件
- **Mempool 交易数据**：pending transactions
- **交易状态**：pending, confirmed, failed
- **Gas 价格**：实时 gas 估算
- **交易分类**：transfer, swap, approval 等

#### 引用机制
- tx hash 作为主键
- 提供 WebSocket 实时更新
- 支持多种区块浏览器链接

#### 事实 vs 解释
- ⚠️ **部分区分**：原始 mempool 数据是事实
- ⚠️ 交易分类和预测是解释

#### 实时 vs 索引
- **实时为主**：WebSocket 推送 mempool 数据
- **无历史索引**：专注于实时监控

#### 优势
- 🟢 真正的实时数据（mempool 级别）
- 🟢 低延迟的交易状态更新
- 🟢 适合监控和预警场景

#### 劣势
- 🔴 API 已停止服务（被 Deloitte 收购后）
- 🔴 上下文包相对简单
- 🔴 无交易模拟功能
- 🔴 历史数据有限

---

### 3.3 Blowfish

**URL**: https://blowfish.xyz  
**类别**: 钱包安全 / 交易模拟

#### 上下文包组件
- **交易模拟结果**：state changes, balance changes
- **风险评分**：0-100 的风险等级
- **风险详情**：具体的风险类型和描述
- **代币授权检测**：approval 类型和金额
- **目标地址分析**：是否已知恶意地址

#### 引用机制
- tx hash 作为主键
- 提供详细的风险分析报告
- 支持链上验证

#### 事实 vs 解释
- ✅ **明确区分**：
  - 事实：模拟结果（state changes, balance changes）
  - 解释：风险评分和风险描述

#### 实时 vs 索引
- **实时模拟**：在签名前模拟交易
- **索引数据库**：恶意地址、已知骗局模式

#### 优势
- 🟢 专注于安全场景，风险分析深入
- 🟢 被 Phantom, Exodus 等钱包集成
- 🟢 支持 Solana, EVM 链
- 🟢 清晰的风险等级划分

#### 劣势
- 🔴 API 需要申请访问
- 🔴 文档访问受限（密码保护）
- 🔴 主要面向 B2B，个人开发者接入门槛高

---

### 3.4 Pocket Universe

**URL**: https://www.pocketuniverse.app  
**类别**: 钱包安全 / 浏览器扩展

#### 上下文包组件
- **交易预览**：签名前的交易结果预览
- **代币授权检测**：unlimited approval 警告
- **钓鱼检测**：已知钓鱼网站警告
- **交易模拟**：balance changes, token transfers

#### 引用机制
- tx hash 作为验证依据
- 提供详细的交易解释
- 链接到区块浏览器验证

#### 事实 vs 解释
- ✅ **明确区分**：
  - 事实：交易模拟结果
  - 解释：风险警告和建议

#### 实时 vs 索引
- **实时模拟**：签名前即时模拟
- **索引数据库**：钓鱼网站、恶意地址

#### 优势
- 🟢 用户友好的交易解释
- 🟢 浏览器扩展形式，易于使用
- 🟢 实时保护

#### 劣势
- 🔴 仅支持浏览器扩展
- 🔴 API 不公开
- 🔴 上下文包相对简单

---

### 3.5 ScamSniffer

**URL**: https://scamsniffer.io  
**类别**: 钱包安全 / 钓鱼检测

#### 上下文包组件
- **地址信誉评分**：基于历史行为
- **钓鱼数据库**：已知钓鱼网站和地址
- **交易风险分析**：签名请求的风险评估
- **URL 扫描**：网站安全性检测

#### 引用机制
- address 作为主键
- 提供详细的分析报告
- GitHub 开源的钓鱼数据库
- API 响应包含置信度分数

#### 事实 vs 解释
- ✅ **明确区分**：
  - 事实：地址历史交易记录
  - 解释：风险评分和分类

#### 实时 vs 索引
- **索引为主**：维护大规模钓鱼数据库
- **实时扫描**：URL 和交易的实时分析

#### 优势
- 🟢 大规模钓鱼数据库（开源）
- 🟢 API 文档完善（ReadMe 平台）
- 🟢 支持多种检测场景
- 🟢 社区驱动的数据更新

#### 劣势
- 🔴 主要聚焦钓鱼检测，功能相对单一
- 🔴 不提供完整的交易模拟
- 🔴 依赖历史数据，新骗局可能漏检

---

### 3.6 ChainGPT

**URL**: https://www.chaingpt.org  
**类别**: AI Agent / 区块链 AI

#### 上下文包组件
- **合约分析**：源代码、ABI、安全审计
- **链上查询**：余额、交易、事件
- **市场数据**：价格、流动性
- **自然语言解释**：交易和合约的人类可读描述

#### 引用机制
- 合约地址作为主键
- 提供链上验证链接
- 部分结果可追溯到链上数据

#### 事实 vs 解释
- ❌ **未明确区分**：AI 生成的解释与链上数据混合
- ❌ 缺少数据来源标注

#### 实时 vs 索引
- **混合模式**：实时查询 + 索引数据
- **AI 生成**：部分上下文由 AI 生成

#### 优势
- 🟢 自然语言界面，易于使用
- 🟢 集成多种链上数据源
- 🟢 支持智能合约分析

#### 劣势
- 🔴 事实与解释混淆
- 🔴 缺少可验证的引用机制
- 🔴 AI 生成内容可能不准确
- 🔴 不适合需要精确数据的场景

---

### 3.7 Moralis

**URL**: https://moralis.com  
**类别**: Web3 数据基础设施 / API

#### 上下文包组件
- **钱包数据**：余额、交易历史、NFT
- **代币数据**：价格、元数据、持有者
- **合约事件**：logs 和 events
- **区块数据**：区块信息、交易详情

#### 引用机制
- API endpoint 作为数据来源
- 包含 chain_id, block_number 等元数据
- 支持多种区块浏览器链接

#### 事实 vs 解释
- ⚠️ **部分区分**：API 返回原始数据，但缺少明确的层级

#### 实时 vs 索引
- **索引为主**：预先索引的链上数据
- **实时更新**：通过 WebSocket 推送新数据

#### 优势
- 🟢 完善的 API 文档
- 🟢 支持多链数据
- 🟢 开发者友好的 SDK
- 🟢 标准化的数据格式

#### 劣势
- 🔴 数据可能有延迟（索引时间）
- 🔴 部分功能需要付费
- 🔴 不提供交易模拟

---

### 3.8 The Graph

**URL**: https://thegraph.com  
**类别**: 索引协议 / 去中心化数据

#### 上下文包组件
- **Subgraph 数据**：自定义索引的链上数据
- **Events**：智能合约事件
- **实体关系**：复杂的链上关系查询
- **时间序列**：历史数据查询

#### 引用机制
- Subgraph ID 作为数据来源
- 包含 block number 作为时间戳
- 支持 GraphQL 查询

#### 事实 vs 解释
- ⚠️ **部分区分**：Subgraph 数据是事实，但 schema 设计是解释

#### 实时 vs 索引
- **纯索引**：预先索引的历史数据
- **最终一致性**：可能有几分钟延迟

#### 优势
- 🟢 去中心化，抗审查
- 🟢 灵活的查询语言（GraphQL）
- 🟢 社区驱动的 subgraph 开发
- 🟢 标准化的数据模型

#### 劣势
- 🔴 需要预先定义 subgraph schema
- 🔴 不适合实时查询
- 🔴 数据延迟（非实时）
- 🔴 需要 GraphQL 知识

---

### 3.9 Phantom Wallet

**URL**: https://phantom.app  
**类别**: 钱包 / 用户界面

#### 上下文包组件
- **交易预览**：签名前的交易结果
- **代币信息**：余额、价格、元数据
- **NFT 展示**：图片、属性、历史
- **交易历史**：已确认的交易列表

#### 引用机制
- tx hash 作为交易标识
- 集成区块浏览器链接
- 提供 human-readable 的交易描述

#### 事实 vs 解释
- ✅ **明确区分**：
  - 事实：交易数据、余额变化
  - 解释：交易描述、风险警告

#### 实时 vs 索引
- **实时模拟**：签名前模拟交易结果
- **索引数据**：交易历史、NFT 元数据

#### 优势
- 🟢 用户友好的交易解释
- 🟢 集成 Blowfish 安全引擎
- 🟢 支持 Solana, Ethereum, Polygon
- 🟢 优秀的移动端体验

#### 劣势
- 🔴 不提供公开 API
- 🔴 上下文包面向终端用户，非开发者
- 🔴 无法自定义上下文格式

---

### 3.10 MetaMask Snaps

**URL**: https://metamask.io/snaps/  
**类别**: 钱包扩展 / 开发者平台

#### 上下文包组件
- **自定义上下文**：由 Snap 开发者定义
- **交易洞察**：额外的交易分析
- **链上数据**：通过 RPC 查询
- **安全警告**：自定义风险检测

#### 引用机制
- 由 Snap 开发者定义
- 支持自定义 UI 组件
- 可链接到任何数据源

#### 事实 vs 解释
- ⚠️ **依赖实现**：由 Snap 开发者决定如何区分

#### 实时 vs 索引
- **实时为主**：签名时查询
- **可选索引**：Snap 可维护自己的索引

#### 优势
- 🟢 高度可定制
- 🟢 开放的开发者平台
- 🟢 可集成任何数据源
- 🟢 支持多种区块链

#### 劣势
- 🔴 开发复杂度高
- 🔴 上下文质量取决于开发者
- 🔴 缺少标准化的上下文格式

---

## 4. 对比分析

### 4.1 上下文包完整性排名

```
1. Tenderly      ████████████████████ 95/100
2. Blowfish      ███████████████████░ 90/100
3. Pocket Universe █████████████████░░░ 85/100
4. Phantom       ████████████████░░░░░ 80/100
5. Moralis       ███████████████░░░░░░ 75/100
6. ScamSniffer   ██████████████░░░░░░░ 70/100
7. The Graph     █████████████░░░░░░░░ 65/100
8. ChainGPT      ████████████░░░░░░░░░ 60/100
9. MetaMask Snaps ███████████░░░░░░░░░░ 55/100
10. Blocknative  ██████████░░░░░░░░░░░ 50/100
```

### 4.2 事实/解释区分

| 等级 | 产品 | 实现方式 |
|------|------|---------|
| ✅ 明确区分 | Tenderly, Blowfish, Pocket Universe, Phantom, ScamSniffer | 分层设计，数据层与解释层分离 |
| ⚠️ 部分区分 | Blocknative, Moralis, The Graph, MetaMask Snaps | 提供原始数据，但缺少明确标注 |
| ❌ 未区分 | ChainGPT | AI 生成内容与链上数据混合 |

### 4.3 实时 vs 索引

| 策略 | 产品 | 适用场景 |
|------|------|---------|
| **纯实时** | Blocknative | Mempool 监控、交易状态跟踪 |
| **实时模拟** | Tenderly, Blowfish, Pocket Universe | 交易预览、安全检测 |
| **索引为主** | The Graph, Moralis | 历史查询、数据分析 |
| **混合模式** | ScamSniffer, ChainGPT, Phantom | 实时查询 + 历史数据 |

---

## 5. 关键洞察

### 5.1 上下文包设计模式

#### 模式 A：分层上下文（Tenderly 模式）
```
┌─────────────────────────────────────┐
│        AI 解释层（可选）              │
├─────────────────────────────────────┤
│        结构化数据层                   │
│  - trace: [...]                     │
│  - logs: [...]                      │
│  - balance_changes: [...]           │
│  - gas_used: 12345                  │
├─────────────────────────────────────┤
│        元数据层                       │
│  - chain_id: 1                      │
│  - block_number: 12345678           │
│  - simulation_id: "abc123"          │
│  - timestamp: "2026-05-21T..."      │
└─────────────────────────────────────┘
```

**优点**：清晰的层级，易于验证，可扩展  
**适用**：开发者工具、API 服务

#### 模式 B：风险导向上下文（Blowfish 模式）
```
┌─────────────────────────────────────┐
│        风险摘要                       │
│  - risk_score: 85                   │
│  - risk_level: "high"               │
│  - summary: "This transaction..."   │
├─────────────────────────────────────┤
│        风险详情                       │
│  - risks: [                         │
│      {type: "approval", ...},       │
│      {type: "phishing", ...}        │
│    ]                                │
├─────────────────────────────────────┤
│        模拟结果                       │
│  - state_changes: [...]             │
│  - balance_changes: [...]           │
└─────────────────────────────────────┘
```

**优点**：用户友好，快速决策  
**适用**：钱包安全、终端用户保护

#### 模式 C：自然语言上下文（ChainGPT 模式）
```
┌─────────────────────────────────────┐
│        AI 生成的解释                   │
│  "This transaction will transfer..." │
├─────────────────────────────────────┤
│        混合数据                       │
│  - 链上数据 + AI 解释混合             │
└─────────────────────────────────────┘
```

**优点**：易于理解，无需技术背景  
**缺点**：难以验证，可能不准确  
**适用**：教育、科普场景

### 5.2 引用机制最佳实践

#### ✅ 推荐做法
```json
{
  "data": {
    "balance_changes": [...],
    "events": [...]
  },
  "metadata": {
    "chain_id": 1,
    "block_number": 12345678,
    "timestamp": "2026-05-21T10:30:00Z",
    "data_source": "rpc_node",
    "verification": {
      "explorer_url": "https://etherscan.io/tx/0x...",
      "simulation_id": "sim_abc123"
    }
  }
}
```

#### ❌ 避免做法
```json
{
  "result": "This transaction is safe"  // 无法验证
}
```

### 5.3 事实 vs 解释的处理策略

#### 策略 1：明确标签（推荐）
```json
{
  "facts": {
    "from": "0x...",
    "to": "0x...",
    "value": "1000000000000000000",
    "source": "chain_state"
  },
  "interpretation": {
    "risk_level": "low",
    "reasoning": "Based on address reputation...",
    "confidence": 0.85
  }
}
```

#### 策略 2：置信度标注
```json
{
  "address_reputation": {
    "score": 85,
    "confidence": 0.9,
    "data_freshness": "2026-05-21T10:00:00Z",
    "source": "indexed_database"
  }
}
```

#### 策略 3：来源追溯
```json
{
  "claim": "This address is associated with phishing",
  "evidence": [
    {
      "type": "on_chain",
      "tx_hash": "0x...",
      "block": 12345678
    },
    {
      "type": "off_chain",
      "source": "scam_database",
      "url": "https://..."
    }
  ]
}
```

---

## 6. 对构建者的建议

### 6.1 上下文包设计原则

1. **完整性**：包含足够的数据让 AI 做出准确判断
   - 必须：chain_id, block_number, tx_hash
   - 推荐：balance_changes, events, gas_used
   - 可选：state_changes, trace

2. **可验证性**：每条数据都应可追溯
   - 提供区块浏览器链接
   - 包含 simulation_id 或 verification_id
   - 标注数据来源（RPC, 索引, 模拟）

3. **时效性**：明确标注数据时间
   - 包含 timestamp
   - 标注数据新鲜度
   - 提供过期时间（如适用）

4. **分层设计**：事实与解释分离
   - 原始数据层（不可变）
   - 分析层（可更新）
   - 解释层（AI 生成）

### 6.2 推荐的上下文包结构

```json
{
  "version": "1.0",
  "context_type": "transaction_preview",
  
  "chain_context": {
    "chain_id": 1,
    "chain_name": "Ethereum Mainnet",
    "block_number": 12345678,
    "block_timestamp": "2026-05-21T10:30:00Z"
  },
  
  "transaction_context": {
    "tx_hash": "0x...",
    "from": "0x...",
    "to": "0x...",
    "value": "1000000000000000000",
    "method": "transfer",
    "params": {...}
  },
  
  "simulation_result": {
    "status": "success",
    "gas_used": 21000,
    "balance_changes": [...],
    "events": [...],
    "state_changes": [...]
  },
  
  "analysis": {
    "risk_score": 85,
    "risk_level": "high",
    "risks": [...],
    "recommendations": [...]
  },
  
  "metadata": {
    "simulation_id": "sim_abc123",
    "data_source": "tenderly_api",
    "generated_at": "2026-05-21T10:30:05Z",
    "verification_url": "https://dashboard.tenderly.co/..."
  }
}
```

### 6.3 常见陷阱

1. **❌ 混合事实与解释**
   - 错误：`"This transaction is malicious"`
   - 正确：`"facts": {...}, "interpretation": {...}`

2. **❌ 缺少引用**
   - 错误：`"risk_score": 85`
   - 正确：`"risk_score": 85, "source": "...", "verification": "..."`

3. **❌ 忽略时效性**
   - 错误：静态数据，不包含时间戳
   - 正确：`"timestamp": "...", "freshness": "5m"`

4. **❌ 过度依赖 AI 生成**
   - 错误：所有内容由 AI 生成
   - 正确：原始数据 + AI 分析分离

5. **❌ 不支持验证**
   - 错误：只有结论，没有证据
   - 正确：提供验证路径（explorer links, simulation IDs）

### 6.4 技术栈建议

| 场景 | 推荐工具 | 原因 |
|------|---------|------|
| 交易模拟 | Tenderly API | 最完整的上下文包 |
| 钱包安全 | Blowfish API | 专业的风险分析 |
| 链上数据查询 | Moralis API | 标准化的数据格式 |
| 历史数据索引 | The Graph | 去中心化、灵活 |
| 钓鱼检测 | ScamSniffer API | 开源数据库 |
| 实时监控 | WebSocket + RPC | 低延迟 |

---

## 附录：参考资料

- Tenderly Documentation: https://docs.tenderly.co
- Blowfish API: https://docs.blowfish.xyz
- ScamSniffer API: https://docs.scamsniffer.io
- Moralis Documentation: https://docs.moralis.com
- The Graph Documentation: https://thegraph.com/docs
- Pocket Universe: https://www.pocketuniverse.app
- ChainGPT: https://www.chaingpt.org
- Phantom Wallet: https://phantom.app
- MetaMask Snaps: https://metamask.io/snaps/

---

> **下一步行动**：
> 1. 选择 1-2 个产品进行深度体验
> 2. 调用 API 测试上下文包结构
> 3. 设计符合"链感知上下文"原则的上下文包格式
> 4. 构建原型验证设计
