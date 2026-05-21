# 最小实践缺少引导：去哪找公开交易？

- **Page**: https://aiweb3.school/zh/handbook/bridge/chain-aware-context/
- **Type**: suggestion
- **Date**: 2026-05-21

## Problem

最小实践第一步说"找一笔公开交易哈希"，但没有给出具体的获取途径。对于 Web3 新手来说，不知道去哪找、什么样的交易适合做练习。

实际操作中，我需要：
1. 找一个可用的公共 RPC 端点
2. 用 eth_getBlockByNumber 拉取最新区块
3. 从区块中筛选出有合约交互的交易
4. 逐个检查哪笔适合分析

这个过程对初学者门槛很高。

## Suggested Fix

建议在最小实践部分补充：

1. **推荐数据来源**：
   - Etherscan 首页 → 最新交易列表
   - 公共 RPC（如 `https://eth.drpc.org`）+ `eth_getBlockByNumber`
   - DEX 交易页面（Uniswap、1inch）找已知交易对的 swap

2. **推荐初学者选择的交易类型**：
   - Uniswap V2/V3 的 Swap 交易（event 结构清晰，容易理解）
   - ERC-20 Transfer 交易（最简单的 event）
   - 避免选择：合约部署、复杂 DeFi 多步操作、治理投票

3. **给出一个具体的公开交易哈希作为起点**，让学员可以直接开始分析，不用先花时间找交易。

## Source

实际做最小实践时，花了较多时间在"找合适的交易"和"找可用的 RPC"上，这些前置步骤和 Chain-aware Context 的学习目标无关，但对新手来说是真实的障碍。
