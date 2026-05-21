# ABI/Event 的"权限检查"未展开

- **Page**: https://aiweb3.school/zh/handbook/bridge/chain-aware-context/
- **Type**: unclear
- **Date**: 2026-05-21

## Problem

ABI / Event 知识节点中提到：

> "能调用不等于应该调用。写交易前还需要权限、余额、allowance、slippage、simulation 和 policy 检查。"

这句话非常重要，但没有展开解释：
- **权限检查**：检查什么？owner？role？怎么查？
- **余额检查**：ETH 余额？ERC-20 余额？两者都要？
- **allowance**：是什么？为什么 swap 前需要 approve？
- **slippage**：怎么设置合理的滑点？
- **simulation**：用什么工具模拟？eth_call？Tenderly？
- **policy 检查**：指什么？Agent 自身的策略？链上的 access control？

对于 Web3 新手，这一段信息密度很高但缺乏上下文，容易产生"我知道很重要但不知道从哪开始"的感觉。

## Suggested Fix

建议：
1. 为每个检查项加一句简短解释（不需要深入，一句话定义即可）
2. 链接到后续章节（如 Security、Agent Wallet、Web3 Tool Use）中更详细的说明
3. 或者在"扩展阅读"中增加一个"交易前检查清单"的参考链接

## Source

做最小实践解码一笔 Uniswap swap 交易时，发现 calldata 中有 slippage 设置、deadline、feeRecipient 等参数，但 Handbook 章节没有解释这些参数的安全意义。
