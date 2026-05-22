# 打卡 — 2026-05-22

## 今日学习内容

今天进入了 AI × Web3 Bridge 的第二章：Web3 Tool Use。核心问题是：AI Agent 怎么安全地调用链上工具？

读完章节后，我用昨天的最小实践（给一笔 Uniswap swap 交易做上下文包）来验证理解：
- 昨天做的是 **Chain-aware Context**（输入层）：从 RPC 读取 tx、从 event log 解码 Swap/Sync/Transfer
- 今天做的是 **Web3 Tool Use**（执行层）：如果 Agent 要执行这笔 swap，需要哪些工具、什么权限、什么日志

两章连起来，构成了一条完整的 Agent 链上交互链路：

```
读取链上状态 → 结构化上下文 → 工具调用 → 权限控制 → 日志审计
```

## 收获与思考

### 1. 读写分离是最基本的安全边界

Handbook 强调：读取和发送必须是不同工具、不同权限。但我在产品调研中发现，Coinbase AgentKit 把读写放在同一个框架里，通过 **policy/限额/白名单** 来区分权限。

这让我想到：读写分离不是"两个 API endpoint"的问题，而是"权限模型设计"的问题。AgentKit 的做法是：所有工具共享一个框架，但每个工具注册时声明自己的权限级别（只读 / 需模拟 / 需确认 / 禁止），由 policy 层统一管控。

这比物理上拆成两个服务更灵活，但也更依赖 policy 层的正确性——如果 policy 有 bug，读写边界就失效了。

### 2. Tool Permission 是 Agent 安全的核心

Handbook 把权限按 5 个维度分层：工具、合约、方法、金额、时间。

我在昨天的交易上下文包实践中遇到了一个具体例子：
- 用户设置了 **400% 的滑点容差**（amountOutMin 远低于实际收到）
- 如果 Agent 有"任意 DeFi swap"工具，这个容差可能被 MEV 三明治攻击利用
- 正确的做法：DeFi Tool 应该内置**最大滑点限制**（比如 5%），超过就拦截

这就是 Handbook 说的："不要给 Agent 一个'帮我调用任意 DeFi 协议'的通用工具。"

### 3. Tool Log 是事后追责的唯一依据

Handbook 说：每次工具调用至少记录 11 个字段（用户目标、工具名、输入、输出、错误、时间、链 ID、区块号、tx hash、确认人、policy 判断）。

这个清单很完整，但我在产品调研中发现，大部分产品（ChainGPT、甚至 Moralis）都没有做到全部记录。真正做到的是安全产品（Blowfish、Blockaid）——因为它们的核心价值就是"事后可审计"。

对产品研究的启示：**Tool Log 不是可选功能，而是 Agent 进入链上执行的必要条件。** 没有日志的 Agent 就像没有监控的服务器——出了问题无法排查。

### 4. 两个章节的知识地图

```
Chain-aware Context（昨天）     Web3 Tool Use（今天）
├── On-chain Data               ├── RPC Tool
├── Contract Docs               ├── Contract Read
├── ABI / Event                 ├── Contract Write
├── Transaction History         ├── Wallet Tool
├── Explorer Context            ├── Explorer Tool
├── Indexing Context            ├── DeFi Tool
└── Citation                    ├── Tool Permission
                                └── Tool Log
```

左边是"Agent 看见什么"，右边是"Agent 能做什么"。两个章节的节点有对应关系：
- On-chain Data ↔ RPC Tool（都涉及链上状态读取）
- ABI / Event ↔ Contract Read/Write（都涉及合约交互）
- Explorer Context ↔ Explorer Tool（都涉及区块浏览器数据）
- Citation ↔ Tool Log（都涉及可追溯性）

## 与产品的关联

昨天调研了 10 个 AI × Web3 产品的 chain-aware context 做法，今天可以对照它们的 tool use 设计：

| 产品 | Chain-aware Context | Web3 Tool Use |
|------|-------------------|---------------|
| Tenderly | 完整的 trace + logs + balance changes | 提供 simulation API（执行前模拟） |
| Blowfish | 交易模拟 + 风险评分 | 实时模拟工具 + 恶意模式匹配 |
| Coinbase AgentKit | 不提供（依赖外部数据源） | 完整的链上 action 工具集 |
| ChainGPT | 混合（AI 生成 + 链上数据） | 自然语言查询，缺少权限分层 |

关键发现：**Context 做得好的产品，Tool Use 也做得好。** Tenderly 和 Blowfish 在两层都有清晰的设计。ChainGPT 两层都混合了事实与解释。

## 明日计划

1. 参加 5.23 Open Agentic Economy（09:30）— ERC-8004/8183 与 Agent Identity 直接关联
2. 推进 Agent Workflow — 理解哪些步骤适合自动化，哪些必须 human-in-the-loop
3. 尝试提交 Week 1 Proof-of-Work Pack（40 分）

---

学习仓库：https://github.com/tiyadegure/ai-web3-school-cohort-0
Handbook：https://aiweb3.school/zh/handbook/
