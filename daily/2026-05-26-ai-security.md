# Daily Note — AI Security 学习笔记

> Handbook 章节：AI Security（AI 安全）
> 日期：2026-05-26
> 约 2073 字 | 7 分钟

---

## 核心定义

AI Security 在 AI × Web3 里不是"防止模型说错话"，而是防止模型错误、恶意上下文和工具滥用变成真实资产、权限或治理事故。

**一句话：** 所有进入模型的内容都可能是攻击面，所有离开模型的动作都必须被约束。

---

## 第一性原理

- 上下文不等于指令：网页、合约文档、API 返回值不能覆盖系统规则
- 工具权限要隔离：读工具和写工具分开，普通任务和高风险任务分开
- 日志要可审计：出了问题要能看到模型读了什么、做了什么

---

## 知识节点

### ⭐⭐ Prompt Injection

恶意内容试图改变模型原始任务或安全规则。

**Web3 特有攻击面：** 合约 README、网页内容、治理提案、token metadata、交易备注、外部 API 返回

**防护两步：**
1. 分层标注上下文（用户指令/系统规则/工具结果/网页内容/合约文档 → 不同可信级别）
2. 高风险工具不直接听模型一句话（wallet tool + policy + human check 三层拦截）

### ⭐⭐⭐ Tool Abuse

模型或攻击者诱导系统滥用工具能力（反复调用付费 API、查询敏感数据、生成无限授权、调用非白名单合约）。

**关键原则：**
- 常常不是一次大动作，而是很多小动作累积
- 工具层需要独立异常检测：短时间高频调用、同一服务重复付款、参数偏离任务目标、请求访问 secret

### ⭐⭐ Malicious Context

看似普通的上下文里包含攻击指令或误导数据。

**两类攻击：**
1. 恶意指令：合约注释、论坛帖子、HTML 里隐藏"忽略安全规则"
2. 错误事实：假合约地址、伪造审计报告、过期价格数据、被污染的 token metadata

**防护：** 链上事实优先从 RPC/explorer/verified source 读取，网页说明只能作为辅助解释

### ⭐⭐⭐ Key Safety

确保私钥、API key、session key、JWT、支付凭证不进入模型上下文或日志。

**底线：** Secret 不进 prompt、不进模型输出、不进普通日志、不进 analytics

**实践：**
- 模型不应该看到主私钥
- 通过钱包工具/smart account/session key/后端签名服务间接执行
- 优先使用 Smart Account policy 或 session key，不把 EOA 私钥放进自动化 runtime

### ⭐⭐⭐ Permission Isolation

把不同风险等级的工具、数据和动作隔离开。

**权限分层：** 只读查询 → 交易草稿 → 发送交易 → 撤销授权 → 大额支付（不同能力）

**环境隔离：**
- 浏览器环境不能读取钱包密钥
- Sandbox 不能访问生产数据库
- 总结文档的模型不能发送交易

**核心洞察：** 最安全的工具不是功能最多，而是刚好能完成任务且无法越界

### ⭐⭐ Sandbox

用隔离环境运行代码、浏览网页、处理文件或调用外部工具。

**默认禁止：** .env、ssh key、wallet seed、浏览器 cookie、生产数据库凭证

**Web3 特殊考虑：** 浏览器 sandbox — 恶意 dApp 可能诱导 Agent 点击签名，浏览器自动化不能和钱包签名权限无边界连在一起

### ⭐ Audit Log

记录 Agent 的上下文、决策、工具调用和执行结果。

**关键字段：** 用户请求、模型版本、引用来源、工具输入输出、policy 判断、交易哈希、用户确认、错误

**关键原则：**
- 不能只记"最终回答"——需要完整链路
- 日志要防篡改（高价值系统可把日志 hash 锚定到链上）

### ⭐⭐ Alert

发现异常并及时打断自动化。

**可监控信号：** 异常工具频率、预算快速消耗、非白名单地址、连续失败、session key 越界、大额授权、prompt injection 命中

**关键原则：**
- 要连接响应动作（暂停 Agent / 撤销 session key / 冻结 escrow / 通知用户 / 人工审核）
- 低风险进后台队列，高风险立即打断

---

## 与 Bridge 知识链的关系

```
Chain-aware Context → Web3 Tool Use → Agent Workflow
→ Agent Wallet → Machine Payment → Settlement & Escrow
→ Agent Identity → Agent Trust & Reputation
→ AI Oracle → Verifiable AI → AI Security
                                        ↓
                                  贯穿所有桥接层
```

**核心洞察：** AI Security 贯穿所有桥接层——Chain-aware Context 要防恶意上下文、Web3 Tool Use 要防工具滥用、Agent Wallet 要防权限扩大。系统设计目标不是让模型永不犯错，而是让模型犯错时无法直接造成不可接受损失。

---

## 与已有知识的关联

| 已学章节 | 与 AI Security 的关系 |
|----------|----------------------|
| Chain-aware Context | 上下文可能包含恶意指令（Malicious Context） |
| Web3 Tool Use | 工具需要权限隔离和异常检测（Tool Abuse） |
| Agent Wallet | Key Safety + Permission Isolation 的核心场景 |
| Settlement & Escrow | 错误输出可能触发错误付款（需要 Alert + Challenge） |
| Verifiable AI | Audit Log 是最基础的可验证层 |
| 主方向 Privacy | Key Safety 直接关联隐私保护 |

---

## 一句话总结

AI × Web3 安全核心：让不可信输入无法直接变成不受限执行。防护 = 分层上下文 + 权限隔离 + Key Safety + Sandbox + Audit Log + Alert + 响应动作。

---

*学习仓库：https://github.com/tiyadegure/ai-web3-school-cohort-0*
