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

---

## 参与方

| 角色 | 地址 | 说明 | 证据 |
|------|------|------|------|
| 发起者 | [0x104b...bbd6](https://etherscan.io/address/0x104ba3aeac0dea30fe9cbef0c344a8f252e6bbd6) | 用户 EOA | tx.from |
| 路由合约 | [0x80a6...5d9e](https://etherscan.io/address/0x80a64c6d7f12c47b7c66c5b4e20e72bc1fcd5d9e) | 未验证合约 (疑似 Uniswap V2 Router 代理) | tx.to, bytecode 1596 bytes |
| Swap 池子 | [0x04d2...53cf](https://etherscan.io/address/0x04d272efea9219ae45765ebb735278cf900453cf) | Uniswap V2 风格池 (Sync+Swap event) | log[3], log[4] |
| WETH | [0xc02a...cc2](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2) | Wrapped Ether (已知合约) | log[0], log[1] |
| 输出代币 | [0xa2e9...72b](https://etherscan.io/address/0xa2e959b8c7d520ed46d1ecc26b39b10eed97b72b) | 未验证合约，用户收到的代币 | log[2] |

---

## 交易流程还原

```
用户 (0x104b)
  │
  │ swapExactETHForTokensSupportingFeeOnTransferTokens()
  │ 发送 0.38 ETH
  ▼
路由合约 (0x80a6) ──── method: 0x088890dc
  │
  │ 1. 将 ETH 存入 WETH
  │    → log[0]: WETH Deposit(0x80a6, 0.38 WETH)
  │
  │ 2. 将 WETH 转入池子
  │    → log[1]: WETH Transfer(0x80a6 → 0x04d2, 0.38 WETH)
  │
  ▼
Uniswap V2 池 (0x04d2)
  │
  │ 3. 执行 swap，输出代币转给用户
  │    → log[2]: Token Transfer(0x04d2 → 0x104b, 16,899,244,787,752,040)
  │    → log[3]: Sync(reserve0, reserve1)
  │    → log[4]: Swap(0x80a6, 0x104b, ...)
  │
  ▼
用户 (0x104b) 收到输出代币
```

---

## 链上事实 vs 我的解释

### ✅ 链上事实（可验证）
- 交易发送了 0.38 ETH → `tx.value = 0x54607fc96a60000 = 0.38 ETH`
- 交易成功 → `receipt.status = 0x1`
- WETH 合约收到 0.38 WETH 存款 → `log[0] Deposit event, data = 0.38 ETH`
- WETH 从路由转到池子 → `log[1] Transfer(0x80a6 → 0x04d2)`
- 池子转出代币给用户 → `log[2] Transfer(0x04d2 → 0x104b)`
- 池子触发 Sync + Swap → `log[3], log[4]`
- Method 是 `swapExactETHForTokensSupportingFeeOnTransferTokens` → `selector 0x088890dc, 4byte.directory`

### ⚠️ 我的解释（需进一步验证）
- 0x80a6... 是 Uniswap V2 Router 代理 → **依据：** bytecode 仅 1596 bytes (符合 minimal proxy 模式)、method selector 匹配 Uniswap V2 Router 函数。**未验证：** 未在 Etherscan 确认源码
- 0x04d2... 是 Uniswap V2 池 → **依据：** 发出 Sync + Swap event，符合 Uniswap V2 Pair 合约模式。**未验证：** 未确认具体交易对 (WETH/???)
- 输出代币数量为 16,899,244,787,752,040 (原始值) → **小数位未知：** 未验证 0xa2e9... 的 decimals，可能是 0.017 (18 dec) 或其他

### ❓ 未解决
- 输出代币 (0xa2e9...) 具体是什么？需要查 Etherscan 或链上 name()/symbol()
- 路由合约 (0x80a6...) 是否已验证源码？
- 池子的具体交易对是什么？(需要查 token0/token1)
- 用户是否设置了 slippage？(需要解码完整 calldata)

---

## Citation 清单

| 结论 | 证据来源 |
|------|----------|
| 用户发送 0.38 ETH | [tx.value](https://etherscan.io/tx/0x11812532acda837a87c9131a26aac5c7b4859c85ae6dde4cf72167d0ae4525bd) |
| 交易成功 | [receipt.status](https://etherscan.io/tx/0x11812532acda837a87c9131a26aac5c7b4859c85ae6dde4cf72167d0ae4525bd) |
| WETH Deposit 0.38 | log[0] on [WETH](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2) |
| WETH Transfer to pool | log[1] |
| Token Transfer to user | log[2] on [0xa2e9...](https://etherscan.io/address/0xa2e959b8c7d520ed46d1ecc26b39b10eed97b72b) |
| Uniswap V2 Swap | log[4] on [0x04d2...](https://etherscan.io/address/0x04d272efea9219ae45765ebb735278cf900453cf) |
| Method = swapExactETH... | [4byte.directory](https://www.4byte.directory/api/v1/signatures/?hex_signature=0x088890dc) |

---

## 数据来源

- RPC: `https://eth.drpc.org`
- Method ABI: [4byte.directory](https://www.4byte.directory)
- Chain: Ethereum Mainnet
- 读取时间: 2026-05-21T02:35:11Z
- 区块时间: 2026-05-21T02:35:11Z
