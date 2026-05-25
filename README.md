# AI × Web3 School Cohort 0 — Week 1 Proof-of-Work Pack

> Personal learning journal and proof-of-work for AI × Web3 School (LXDAO + ETHPanda)

## 学员画像
- AI：有基础 | Web3：新手 | 方向：产品研究 | 每日 1-2h

---

## 📅 每日学习记录

| 日期 | 主题 | 笔记 |
|------|------|------|
| 5.20 | Web3 运行原理 + Co-learning | [daily/2026-05-20.md](daily/2026-05-20.md) |
| 5.21 | AI 下乡计划 + Chain-aware Context | [daily/2026-05-21.md](daily/2026-05-21.md) |
| 5.22 | Web3 Tool Use + Week 1 例会 | [daily/2026-05-22.md](daily/2026-05-22.md) |
| 5.23 | Agent Workflow + Open Agentic Economy | [daily/2026-05-23.md](daily/2026-05-23.md) |
| 5.24-25 | Agent Wallet + 合约部署 + 活动参与 | [daily/2026-05-24.md](daily/2026-05-24.md) |

---

## 🎯 Week 1 产出清单

### 1. AI × Web3 最小交叉流程图（30 分）
Agent 辅助 ERC-20 Swap 的 8 步流程，标出 AI 自动（5步）、人工确认（1步）、钱包签名（1步）、链上确认（1步）的边界。
- [流程图 Markdown](tasks/ai-web3-cross-flow.md)
- [流程图 HTML 可视化](tasks/ai-web3-cross-flow.html)

### 2. 受限 Web3 助手设计 — DeFi Swap Guardian（40 分）
设计一个受限 swap 助手：10 个状态的状态机 + 5 个人工确认点 + 6 个风险分析 + Policy 规则。
- [设计文档](tasks/restricted-web3-assistant.md)

### 3. EOA vs 智能账户 vs 多签权限对比（30 分）
从安全性、灵活性、成本三个维度对比三种账户方案在 Agent 场景下的表现。
- [对比文档](tasks/eoa-vs-smart-account-vs-multisig.md)

### 4. Sepolia 测试网合约部署（30 分）
部署 SimpleCounter 合约，验证 部署→读取→写入 全流程。
- 合约地址：`0xb4fbaf9f4b68eed3887f557b356b47fa7455ea63`
- [合约代码](experiments/SimpleCounter.sol)
- 部署交易：[0x360e...fff40f](https://web3.okx.com/zh-hans/explorer/sepolia/tx/0x360e948281ecfbf4d1eafb678fe8c92cce7fea2a730e1141c2b32b63e1fff40f)
- increment 交易：[0x1ccf...a1d422](https://web3.okx.com/zh-hans/explorer/sepolia/tx/0x1ccf01917ef6350dac2293cfb2f32a4e3b72db20d8bbb6a598e43a2510a1d422)
- count 读取结果：1

### 5. Chain-aware Context 实践（15 分）
用真实 Uniswap V2 交易构建上下文包，解开所有未知项（SPCX 代币、交易对、滑点 400%）。
- [交易上下文包](tasks/chain-aware-context-practice.md)

### 6. 产品研究报告（30 分）
10 个 AI×Web3 产品对比分析报告。
- [产品对比报告](tasks/product-research-chain-context.md)

### 7. 学习总结博客（20 分）
[AI × Web3 School Week 1：从"Agent 能做什么"到"Agent 应该被允许做什么"](https://blog.degure.me/blog/ai-web3-school-week-1/)

---

## 🔗 知识串联

```
Day 1: Chain-aware Context（事实来源：链上数据从哪来）
         ↓
Day 2: Web3 Tool Use（执行能力：Agent 怎么调工具）
         ↓
Day 3: Agent Workflow（流程骨架：怎么串成可控流程）
         ↓
Day 4: Agent Wallet（权限边界：Agent 能做什么、不能做什么）
         ↓
       流程图 + 受限助手 + 账户对比 = 可控的 Agent 链上操作体系
```

---

## ⚠️ 遇到的问题和人工修正

### 问题 1：WCB API 域名 DNS 故障
- **现象：** `app.theagentfund.ai` 全球 DNS 解析失败（NXDOMAIN）
- **排查：** 尝试了 Google DNS（8.8.8.8），确认是域名本身的问题
- **修正：** 发现新域名 `web3career.build` 支持 API，endpoint 为 `POST /api/agent/call`
- **教训：** API 域名可能变更，需要定期验证可达性

### 问题 2：误连主网部署合约
- **现象：** 在 Remix 部署合约时，OKX Wallet 默认连接 Ethereum 主网，gas 费用显示真实 ETH
- **修正：** 取消交易，手动切换到 Sepolia 测试网后再部署
- **教训：** 部署前必须确认网络，不能只看 gas 数字

### 问题 3：日期混乱
- **现象：** 把 5/24 的内容写进了 5/23 的 daily note
- **修正：** 恢复 23 号原版，新建 24 号文件
- **教训：** 跨日期工作时要注意文件命名

---

## 📊 活动参与记录

| 日期 | 活动 | 类型 |
|------|------|------|
| 5.18 | AI 时代的 Web3 架构能力 | 实时参加 |
| 5.19 | AI Agent 入门：Hermes 从 0 到 1 | 实时参加 |
| 5.20 | Web3 运行原理 | 实时参加 |
| 5.20 | Co-learning | 实时参加 |
| 5.21 | AI 下乡计划 | 实时参加 |
| 5.22 | Week 1 例会 | 实时参加 |
| 5.22 | Co-learning | 实时参加 |
| 5.23 | Open Agentic Economy（ERC-8004） | 实时参加 |
| 5.25 | Co-learning（Railgun 隐私协议） | 实时参加 |
| 5.25 | Long-term Memory for AI Agents | 实时参加 |

---

## 📝 Handbook Feedback

4 条反馈：[handbook-feedback/](handbook-feedback/)
1. 最小实践缺引导
2. 权限检查未展开
3. 缺上下文包示例
4. On-chain Data 与 Explorer Context 边界模糊

---

*AI × Web3 School — LXDAO + ETHPanda*
