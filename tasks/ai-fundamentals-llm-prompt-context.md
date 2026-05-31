# AI 基础三章学习笔记：LLM / Prompt / Context

## 学习信息
- 日期：2026-05-31
- 章节：Handbook AI 基础 — LLM / Prompt / Context
- 学员：Tiya Degurechaff
- 方向：Privacy / Security / Sovereignty（ShadowAgent）

---

## 1. LLM — 大语言模型

### 核心观点
模型输出是候选结果，不是事实本身。LLM 是概率模型，把大量文本、代码和多模态信号压进参数里。

### 关键知识节点

**Token**
- 模型处理文本的基本单位，不等于一个汉字或单词
- 直接影响三件事：上下文能放多少、调用成本是多少、模型能不能完整看见关键信息
- 代码、JSON、长标识符、表格和混合语言文本比普通段落更吃 token

**Embedding**
- 把文本映射成向量，衡量语义接近度
- 适合搜索、聚类、RAG
- 不适合单独判断结论是否正确 — 向量相似度 ≠ 正确性

**Transformer**
- 核心能力来自 attention：在生成时关注输入中的不同位置
- 擅长在上下文中找模式，不等于拥有稳定数据库

**Hallucination**
- 看起来合理但不真实或无法验证的内容
- 在带执行能力的系统里 = 流程风险（错误参数、错误权限解释）
- 处理方式：外部校验（来源引用、schema 校验、规则检查、人工确认）

**Multimodal**
- 处理文本、图片、音频、视频
- 关键判断仍要回到结构化数据和可信来源

### 在 AI×Web3 中的位置
LLM 处于理解和生成层，配合四层系统：
- 数据层：RPC、索引器、预言机、向量库
- 编排层：Prompt、Context、RAG、Agent workflow
- 执行层：工具调用、钱包、Smart Account、合约交互
- 安全层：Guard、simulation、权限策略、人工确认

### 最小实践
"交易解释器"：输入交易哈希，让 LLM 生成解释，要求分开模型生成/链上事实/来源边界/不确定性。

---

## 2. Prompt — 提示词

### 核心观点
Prompt 是软约束，不是安全边界。真正边界由代码、权限、校验和审计承担。

### 关键知识节点

**Instruction**
- 任务规则，拆成四段：任务目标 → 可用输入 → 禁止行为 → 输出格式+失败格式
- 区分"解释"和"执行"：研究助手可以整理资料，但不能假装结论已被验证

**Few-shot**
- 少量示例让模型模仿判断方式和输出格式
- 示例要跟 eval 一起维护，协议升级后旧示例可能误导模型

**Structured Output**
- JSON schema / 函数参数 / schema 约束字段
- 例如：action / risk_level / requires_human_approval / uncertainties
- 目的：让后续代码能检查、拒绝、记录和回归测试

**Prompt Injection**
- 攻击者通过外部内容让模型忽略原始规则
- Agent 场景尤其危险：模型能读私有上下文、调用工具、写入系统
- 防护：
  - 外部内容标记为不可信数据
  - 工具调用前参数校验
  - 敏感动作 allowlist + human approval
  - 不把密钥/主权限/不可撤销动作交给模型

### 在 AI×Web3 中的位置
Prompt → Context → Model → Code → Guard/simulation → Human check

### 最小实践
"交易风险摘要" prompt：输入交易详情，输出固定 JSON（summary/asset_changes/risk_level/uncertainties），测试普通转账/无限授权/意图不匹配三种场景。

---

## 3. Context — 上下文

### 核心观点
模型只能基于它看见的上下文行动；系统必须决定什么能进上下文、带着什么身份进去、过期后怎么退出。

### 关键知识节点

**Context Window**
- 一次请求能处理的最大上下文范围
- 大窗口 ≠ 完美使用，长上下文常见"看见了但没抓住重点"
- 应配合检索、摘要和结构化数据使用

**Context Engineering**
- 设计上下文进入模型的方式：选择/排序/裁剪/标注来源/隔离不可信内容
- 稳定的 Agent 上下文应包含：任务状态 + 工具结果 + 日志 + 可信来源 + 检查结果 + 用户意图 + 禁止事项

**Memory**
- 跨请求保留的信息（用户偏好、历史任务、常用钱包）
- 不能替代实时授权 — 过去允许 ≠ 现在允许
- 涉及身份/权限/资产的记忆必须重新绑定当前授权

**Knowledge Base**
- 可检索的外部知识库
- 需要维护：来源/URL、更新时间、协议版本、适用环境、官方/第三方、是否需要复核

### 上下文分层设计
1. 指令层：系统规则、工具使用规则、禁止事项
2. 任务层：用户目标、本次会话参数
3. 事实层：链上状态、工具结果、simulation
4. 知识层：文档、标准、论坛、历史案例
5. 记忆层：用户偏好和项目配置

### 最小实践
"钱包授权检查 Agent" context spec：列出回答前必须拿到的上下文（chain id、token、spender、allowance、simulation等），区分哪些必须实时查询/哪些可缓存/哪些不能被模型当事实。

---

## ShadowAgent 映射总结

| Handbook 概念 | ShadowAgent 应用 |
|---|---|
| LLM Hallucination | Agent 可能编造合约地址或错误 gas 估算 |
| Prompt Injection | 恶意 dApp 通过交易数据注入指令 |
| Structured Output | 支付指令 JSON schema 校验 |
| Context 分层 | 指令层(隐私规则) / 事实层(链上) / 知识层(x402 spec) |
| Memory ≠ 授权 | 每次支付重新确认，不依赖历史授权 |
| 外部内容不可信 | dApp 页面/第三方文档标记 untrusted |
| Token 管理 | Railgun proof 数据大，需压缩后放入 context |
| Knowledge Base | x402 spec / Railgun docs / Semaphore docs 版本管理 |
