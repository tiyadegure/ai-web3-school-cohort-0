# Week 4 Sprint Plan — AuditAgent

> 冲刺周期：2026-06-09 ~ 2026-06-15
> 目标：完成 MVP Demo，可展示 Detect → Patch → Exploit 全流程

---

## Sprint 目标

用一个真实漏洞合约跑通完整审计流程，产出可演示的 Demo。

## 每日任务分解

### Day 1 (6.09 周一) — 环境搭建 + Agent 框架
- [ ] 初始化项目仓库，配置 Python 虚拟环境
- [ ] 安装 CrewAI、Slither、Foundry、web3.py
- [ ] 搭建 5 Agent 基础框架（角色定义 + 通信协议）
- [ ] 编写 Agent 间消息传递接口

### Day 2 (6.10 周二) — 工具链集成
- [ ] 集成 Slither 静态分析工具
- [ ] 实现 Source Fetcher（从 Etherscan 获取合约源码）
- [ ] 实现 State Reader（读取链上合约状态）
- [ ] 测试工具链基础功能

### Day 3 (6.11 周三) — RAG 知识库
- [ ] 搭建 ChromaDB 向量数据库
- [ ] 导入 ERC 标准文档（ERC-20/721/1155）
- [ ] 导入常见漏洞模式（Reentrancy/Overflow/Access Control 等）
- [ ] 实现语义检索接口

### Day 4 (6.12 周四) — Detect 模式实现
- [ ] 实现 Auditor Agent 的漏洞扫描逻辑
- [ ] 集成 Slither 分析结果 + RAG 知识库
- [ ] 输出结构化漏洞报告（类型/位置/严重程度/建议）
- [ ] 用测试合约验证 Detect 功能

### Day 5 (6.13 周五) — Patch 模式实现
- [ ] 实现 Architect Agent 的修复方案设计
- [ ] 实现 Code Generator Agent 的代码生成
- [ ] 实现 Refiner Agent 的迭代优化
- [ ] 用测试合约验证 Patch 功能

### Day 6 (6.14 周六) — Exploit 验证 + 链上证明
- [ ] 实现 Validator Agent 的 Exploit 验证
- [ ] 集成 Foundry Forge 进行合约测试
- [ ] 实现审计结果上链存证
- [ ] 端到端流程联调

### Day 7 (6.15 周日) — Demo 准备 + 文档
- [ ] 准备 3 个演示用漏洞合约（Reentrancy/Unchecked Return/Access Control）
- [ ] 录制 Demo 视频
- [ ] 编写项目文档和 README
- [ ] 提交黑客松作品

---

## 里程碑

| 日期 | 里程碑 | 交付物 |
|------|--------|--------|
| 6.10 | 工具链就绪 | Slither/Forge/RPC 可正常调用 |
| 6.12 | Detect 可用 | 能输出漏洞报告 |
| 6.14 | 全流程跑通 | Detect→Patch→Exploit 完整执行 |
| 6.15 | Demo 就绪 | 视频 + 文档 + 可运行代码 |

## 风险与应对

| 风险 | 影响 | 应对方案 |
|------|------|----------|
| AI 模型 API 限流 | 生成速度慢 | 本地缓存 + 批量请求优化 |
| Slither 误报率高 | 审计结果不准 | 结合 RAG 知识库二次验证 |
| Forge 环境配置复杂 | 测试耗时 | 提前准备 Docker 镜像 |
| 合约源码获取失败 | 无法分析 | 支持本地文件输入作为备选 |

## 每日站会

- 时间：每天 19:00 (UTC+8)
- 内容：昨日完成 / 今日计划 / 阻塞问题

---

*Z.AI Hackathon | AI × Web3 School Cohort 0*
