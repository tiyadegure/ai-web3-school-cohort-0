# On-chain Data 和 Explorer Context 边界模糊

- **Page**: https://aiweb3.school/zh/handbook/bridge/chain-aware-context/
- **Type**: unclear
- **Date**: 2026-05-21

## Problem

On-chain Data 和 Explorer Context 两个知识节点都涉及"读取链上数据"，但它们的区别和使用场景不够清晰。

- **On-chain Data** 强调："常见来源包括 RPC、区块浏览器、索引器和协议 API"
- **Explorer Context** 强调："区块浏览器提供的可视化链上证据"

问题是：On-chain Data 的来源列表中已经包含了"区块浏览器"，和 Explorer Context 的定义重叠。读者不清楚什么时候该归类为 On-chain Data，什么时候该归类为 Explorer Context。

## Suggested Fix

建议明确区分：

1. **On-chain Data** 聚焦于"数据本身"——通过 RPC 或 API 直接获取的原始链上状态（余额、交易、日志、合约状态）。强调数据的结构、字段和时间性。

2. **Explorer Context** 聚焦于"数据的可检查性和可展示性"——如何把链上数据变成用户和开发者可以点击验证的链接。强调的是可追溯性和信任建立，而不是数据获取。

或者考虑合并为一个节点，用子标题区分"数据获取"和"数据展示"两个维度。

## Source

在构建交易上下文包时，我同时用到了 RPC 直接查询（On-chain Data）和 Etherscan 链接（Explorer Context），实际操作中两者是交织在一起的，很难在概念上清晰分开。
