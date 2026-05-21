# 缺少完整的上下文包示例

- **Page**: https://aiweb3.school/zh/handbook/bridge/chain-aware-context/
- **Type**: suggestion
- **Date**: 2026-05-21

## Problem

章节在"最小实践"部分描述了上下文包应该包含的 5 个步骤，但没有给出一个完整的、可参考的示例输出。

学员知道"应该写模型可读的上下文"，但不清楚：
- 最终输出长什么样？是 markdown？JSON？结构化文本？
- "每个关键结论附 explorer 链接"具体怎么附？
- "标出哪些是事实，哪些是解释"用什么格式区分？

## Suggested Fix

建议在最小实践后附加一个**完整的示例输出**，包含：

1. 交易概览表（chain id、block、status、gas 等）
2. 参与方表格（地址 + 角色 + 证据来源）
3. 流程还原（文本流程图）
4. 链上事实 vs 我的解释（两列对比）
5. Citation 清单（结论 → 证据链接）

不需要很长，一个简洁的 Uniswap swap 交易示例就够了。这会让学员明确知道"做到什么程度算完成"。

## Source

我在做最小实践时，参考了 Chain Context 章节的所有要求，自己构建了一个完整上下文包（见 tasks/chain-aware-context-practice.md）。过程中多次猜测输出格式，如果有示例会节省很多时间。
