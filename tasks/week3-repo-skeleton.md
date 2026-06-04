# AuditAgent — AI 多代理智能合约安全审计系统

> Z.AI 赛道 | Web3 × Long-Horizon Task

## 项目概述

AuditAgent 是一个基于多 Agent 协作的智能合约安全审计系统，能够自动完成从漏洞检测到修复验证的端到端审计流程。

## 核心特性

- **5 Agent 协作架构**：Auditor / Architect / Code Generator / Refiner / Validator
- **6 领域工具链**：Slither / Source Fetcher / State Reader / Code Sanitizer / Forge / Revenue Normalizer
- **三种工作模式**：Detect → Patch → Exploit（端到端验证）
- **RAG 知识库**：ChromaDB + ERC 标准 + 历史漏洞模式
- **链上证明**：审计结果上链存证

## 技术栈

| 组件 | 技术 |
|------|------|
| AI 模型 | MiMo V2.5 Pro（直连 API） |
| 多代理框架 | CrewAI |
| 静态分析 | Slither |
| 合约执行 | Foundry (Forge) |
| 知识库 | ChromaDB + RAG |
| 链上集成 | web3.py |
| MCP 服务器 | Python SDK |

## 项目结构

```
auditagent/
├── src/
│   ├── agents/          # 5 个 Agent 实现
│   │   ├── auditor.py
│   │   ├── architect.py
│   │   ├── code_generator.py
│   │   ├── refiner.py
│   │   └── validator.py
│   ├── tools/           # 6 个领域工具
│   │   ├── slither_tool.py
│   │   ├── source_fetcher.py
│   │   ├── state_reader.py
│   │   ├── code_sanitizer.py
│   │   ├── forge_tool.py
│   │   └── revenue_normalizer.py
│   ├── knowledge/       # RAG 知识库
│   ├── evaluation/      # 评估框架
│   ├── chain/           # 链上验证
│   └── mcp/             # MCP 服务器
├── tests/               # 测试用例
├── data/
│   └── skills/          # forefy/.context Skills
├── papers/              # 参考论文
├── contracts/           # 测试用漏洞合约
└── docs/                # 文档
```

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/tiyadegure/auditagent.git
cd auditagent

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入 API Key

# 运行审计
python -m auditagent audit --contract contracts/sample.sol
```

## 工作流程

```
输入合约
    ↓
[Auditor] 静态分析 + 漏洞扫描
    ↓
[Architect] 设计修复方案
    ↓
[Code Generator] 生成修复代码
    ↓
[Refiner] 迭代优化
    ↓
[Validator] 验证修复有效性
    ↓
输出审计报告 + 链上证明
```

## 参考论文

1. LLM-based Smart Contract Vulnerability Detection
2. Multi-Agent Collaboration for Code Security
3. RAG-Enhanced Vulnerability Pattern Matching
4. Automated Patch Generation and Validation
5. On-chain Audit Trail for Compliance

## License

MIT

---

*AI × Web3 School Cohort 0 | Z.AI Hackathon*
