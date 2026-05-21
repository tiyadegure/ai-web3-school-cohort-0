# Chain-aware Context 实践 — 交易上下文包

> 练习目标：给一笔真实链上交易构建「模型可读、可引用、可验证」的上下文包。

---

## 交易概览

| 字段 | 值 | 来源 |
|------|-----|------|
| Chain | Ethereum Mainnet (chain id: 1) | RPC |
| Tx Hash | [0x1181...25bd](https://etherscan.io/tx/0x11812532acda837a87c9131a26aac5c7b4859c85ae6dde4cf72167d0ae4525bd) | eth_getTransactionByHash |
| Block | [25140663](https://etherscan.io/block/25140663) | eth_getTransactionByHash |
| 时间 | 2026-05-21T02:35:11Z | block.timestamp |
| Status | ✅ 成功 | eth_getTransactionReceipt |
| Gas Used | 166,508 / 263,763 (63.1%) | eth_getTransactionReceipt |
| Gas Price | 88.09 Gwei | eth_getTransactionByHash |
| Type | EIP-1559 (type 2) | tx.type |
| Method | `swapExactETHForTokensSupportingFeeOnTransferTokens` | selector 0x088890dc, [4byte.directory](https://www.4byte.directory/api/v1/signatures/?hex_signature=0x088890dc) |

---

## 交易详情

- **输入**: 0.38 ETH
- **输出**: 16,899,244.79 SPCX (Space Exploration Technologies Corp.)
- **汇率**: 1 ETH ≈ 44,471,697 SPCX
- **路径**: WETH → SPCX
- **滑点设置**: amountOutMin = 3,379,848.96 SPCX（实际收到是最低要求的 5 倍，滑点容差极宽）
- **截止时间**: 2026-05-21T02:35:12Z（区块时间后 1 秒，非常紧凑）

---

## 参与方

| 角色 | 地址 | 说明 | 证据 |
|------|------|------|------|
| 发起者 | [0x104b...bbd6](https://etherscan.io/address/0x104ba3aeac0dea30fe9cbef0c344a8f252e6bbd6) | 用户 EOA | tx.from |
| 路由合约 | [0x80a6...5d9e](https://etherscan.io/address/0x80a64c6d7f12c47b7c66c5b4e20e72bc1fcd5d9e) | EIP-1967 代理，implementation: [0x71ea...812b](https://etherscan.io/address/0x71ea8223a24b82456f22716f787219bc15db812b) (bytecode 46,654 chars, 疑似 Uniswap V2 Router02) | EIP-1967 storage slot |
| Swap 池子 | [0x04d2...53cf](https://etherscan.io/address/0x04d272efea9219ae45765ebb735278cf900453cf) | Uniswap V2 Pair: **SPCX / WETH** | token0(), token1() |
| WETH | [0xc02a...cc2](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2) | Wrapped Ether | 已知合约 |
| SPCX | [0xa2e9...72b](https://etherscan.io/address/0xa2e959b8c7d520ed46d1ecc26b39b10eed97b72b) | Space Exploration Technologies Corp. (9 decimals) | name(), symbol(), decimals() |
| Fee Recipient | [0x5c69...aa6f](https://etherscan.io/address/0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f) | Uniswap V2 Factory | 已知合约 |

---

## 交易流程还原

```
用户 (0x104b)
  │
  │ swapExactETHForTokensSupportingFeeOnTransferTokens(
  │   amountOutMin: 3,379,848.96 SPCX,
  │   path: [WETH, SPCX],
  │   to: 0x104b (自己),
  │   deadline: +1s,
  │   feeRecipient: Uniswap V2 Factory
  │ )
  │ 发送 0.38 ETH
  ▼
路由合约 (0x80a6, proxy → 0x71ea)
  │
  │ 1. 将 ETH 存入 WETH
  │    → log[0]: WETH Deposit(0x80a6, 0.38 WETH)
  │    [链上事实]
  │
  │ 2. 将 WETH 转入池子
  │    → log[1]: WETH Transfer(0x80a6 → 0x04d2, 0.38 WETH)
  │    [链上事实]
  │
  ▼
Uniswap V2 池 (0x04d2) — SPCX/WETH
  │
  │ 3. 执行 swap，输出 SPCX 给用户
  │    → log[2]: SPCX Transfer(0x04d2 → 0x104b, 16,899,244.79 SPCX)
  │    → log[3]: Sync(reserve0, reserve1)
  │    → log[4]: Swap(0x80a6, 0x104b, ...)
  │    [链上事实]
  │
  ▼
用户 (0x104b) 收到 16,899,244.79 SPCX
```

---

## 池子流动性分析

- **交易对**: SPCX / WETH
- **SPCX reserve**: 0.03 SPCX (27,590,880 raw, 9 decimals)
- **WETH reserve**: ~0.000001 WETH (900,927,153 raw, 18 decimals)
- **池子价格**: 1 SPCX ≈ 0.000000033 WETH
- **TVL**: 极低（约 0.000006 ETH 级别）

⚠️ 这是一个**极低流动性的池子**，0.38 ETH 的交易对价格产生了巨大冲击。

---

## 链上事实 vs 我的解释

### ✅ 链上事实（可验证）
- 发送 0.38 ETH → `tx.value`
- 交易成功 → `receipt.status = 0x1`
- WETH Deposit 0.38 → `log[0]`
- WETH → 池子 Transfer → `log[1]`
- 池子 → 用户 SPCX Transfer (16,899,244,787,752,040 raw) → `log[2]`
- Uniswap V2 Sync + Swap → `log[3], log[4]`
- Method = `swapExactETHForTokensSupportingFeeOnTransferTokens` → `selector 0x088890dc`
- 路由是 EIP-1967 代理 → `implementation at 0x71ea...812b`
- 池子 token0=SPCX, token1=WETH → `token0(), token1()`
- SPCX name="Space Exploration Technologies Corp.", symbol="SPCX", decimals=9 → `name(), symbol(), decimals()`
- amountOutMin = 3,379,848,957,550,408 raw → `calldata`
- deadline = 2026-05-21T02:35:12Z → `calldata`
- feeRecipient = 0x5c69... (Uniswap V2 Factory) → `calldata`

### ⚠️ 我的解释（需进一步验证）
- 路由实现 (0x71ea...) 是 Uniswap V2 Router02 → **依据：** bytecode 46,654 bytes 匹配已知 Router02 大小 + method selector 匹配。**未在 Etherscan 确认源码**
- "Space Exploration Technologies Corp." 是 meme/仿盘代币 → **依据：** 极低流动性、名称模仿 SpaceX。**未验证项目方信息**

### ✅ 已解决（原 ❓）
- ~~输出代币是什么？~~ → **SPCX (Space Exploration Technologies Corp.), 9 decimals**
- ~~池子交易对？~~ → **SPCX / WETH**
- ~~滑点设置？~~ → **amountOutMin 3,379,848.96 SPCX，实际收到 16,899,244.79 SPCX，容差极宽（~400%）**

---

## 产品研究洞察

1. **滑点容差过宽**: 用户设置了 ~400% 的滑点容差，在低流动性池子中这意味着可能被 MEV 三明治攻击大量抽取价值
2. **流动性极低**: TVL 仅约 0.000006 ETH，0.38 ETH 的买入会造成巨大价格冲击
3. **仿盘代币**: "Space Exploration Technologies Corp." 模仿 SpaceX 命名，极低流动性，典型的小市值/meme 代币特征
4. **路由是代理合约**: EIP-1967 proxy 模式意味着路由逻辑可升级，用户应信任 implementation 合约

---

## Citation 清单

| 结论 | 证据来源 |
|------|----------|
| 用户发送 0.38 ETH | [tx.value](https://etherscan.io/tx/0x11812532acda837a87c9131a26aac5c7b4859c85ae6dde4cf72167d0ae4525bd) |
| 交易成功 | [receipt.status](https://etherscan.io/tx/0x11812532acda837a87c9131a26aac5c7b4859c85ae6dde4cf72167d0ae4525bd) |
| WETH Deposit 0.38 | log[0] on [WETH](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2) |
| SPCX Transfer 16.9M | log[2] on [SPCX](https://etherscan.io/address/0xa2e959b8c7d520ed46d1ecc26b39b10eed97b72b) |
| Uniswap V2 Swap | log[4] on [Pool](https://etherscan.io/address/0x04d272efea9219ae45765ebb735278cf900453cf) |
| Pool = SPCX/WETH | token0(), token1() |
| SPCX = 9 decimals | decimals() |
| 路由是 EIP-1967 代理 | storage at impl slot |
| amountOutMin / deadline / path | calldata decode |
| feeRecipient = Uniswap V2 Factory | calldata decode, [已知地址](https://etherscan.io/address/0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f) |

---

## 数据来源

- RPC: `https://eth.drpc.org`
- Method ABI: [4byte.directory](https://www.4byte.directory)
- Chain: Ethereum Mainnet
- 读取时间: 2026-05-21
- 区块时间: 2026-05-21T02:35:11Z
