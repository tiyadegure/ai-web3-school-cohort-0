# Proposal Memo — AuditAgent

> 项目提案备忘录 | Z.AI 赛道

---

## 1. 项目名称

AuditAgent — AI 多代理智能合约安全审计系统

## 2. 问题陈述

智能合约安全审计面临三大痛点：

- **人工审计成本高**：专业审计师收费 $5K-$50K/合约，中小项目难以负担
- **现有工具局限**：Slither/Mythril 等静态分析工具误报率高，无法理解业务逻辑
- **修复验证缺失**：检测漏洞后无法自动验证修复是否有效

## 3. 解决方案

构建 5 Agent 协作的端到端审计系统：

| Agent | 职责 |
|-------|------|
| Auditor | 调用 Slither + RAG 进行漏洞扫描 |
| Architect | 设计修复方案 |
| Code Generator | 生成修复代码 |
| Refiner | 迭代优化代码质量 |
| Validator | 用 Forge 验证修复有效性 |

## 4. 为什么是 Long-Horizon Task

- **多步决策**：5 个 Agent 需要协调完成 6+ 个步骤
- **持续工具调用**：Slither → RPC → RAG → Forge 循环调用
- **迭代反馈**：Detect → Patch → Validate 闭环，修复无效需返回重做
- **端到端交付**：从输入合约到输出审计报告 + 链上证明

## 5. 技术架构

```
输入合约 → [Auditor] → [Architect] → [Code Generator] → [Refiner] → [Validator]
              ↓              ↓               ↓               ↓            ↓
           Slither        RAG            Code Gen         Review       Forge
              ↓              ↓               ↓               ↓            ↓
           漏洞报告      修复方案         修复代码         优化代码     验证结果
                                                                              ↓
                                                                       链上存证
```

## 6. 差异化优势

| 对比维度 | 传统工具 | AuditAgent |
|----------|----------|------------|
| 检测深度 | 模式匹配 | RAG + 业务逻辑理解 |
| 修复能力 | 无 | 自动生成修复代码 |
| 验证能力 | 无 | Forge 端到端验证 |
| 协作模式 | 单工具 | 5 Agent 分工协作 |

## 7. 预期产出

- 可运行的审计系统 Demo
- 3+ 个真实漏洞合约的审计案例
- 审计结果链上存证
- 项目文档 + 技术博客

---

*Z.AI Hackathon | AI × Web3 School Cohort 0*
