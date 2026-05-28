# x402 Paywall + CAW 支付闭环 实操笔记

## 任务信息
- **来源：** Week 2 高级实践任务
- **分值：** 40 分
- **前置依赖：** Machine Payment 深入阅读 ✅
- **完成日期：** 2026-05-27

---

## 一、x402 核心概念

### 什么是 x402？
x402 是**互联网原生支付标准**，基于 HTTP 402 Payment Required 状态码构建。

**核心价值：**
- 0 协议费（只付网络手续费）
- 原生支持机器对机器支付（AI Agent 可自主付费）
- 内置微支付支持（含 EVM 批量结算）
- 无需账户、会话或凭证管理

### x402 标准流程

```
┌─────────────┐    ① 请求资源     ┌─────────────┐
│   Client    │ ───────────────→  │   Server    │
│  (Buyer)    │                   │  (Seller)   │
└─────────────┘                   └─────────────┘
       ↑                                │
       │                                │
       │    ② 返回 402 + 付款要求       │
       │ ←──────────────────────────────┘
       │
       │    ③ 准备并提交付款 payload
       │ ──────────────────────────────→
       │
       │    ④ 验证并结算付款
       │ ←──────────────────────────────
       │
       │    ⑤ 返回请求的资源
       │ ←──────────────────────────────
```

### 关键组件

| 组件 | 作用 |
|------|------|
| **Client** | 发起请求的一方（人类或 AI Agent） |
| **Server** | 提供服务的一方，设置付费墙 |
| **Facilitator** | 验证和结算付款的第三方（如 x402.org/facilitator） |
| **Wallet** | 收发资金的钱包（支持 EVM、Solana、Algorand 等） |

---

## 二、Seller 端实现（Paywall 设置）

### 安装依赖
```bash
# Express
npm install @x402/express @x402/core @x402/evm

# 或 FastAPI (Python)
pip install "x402[fastapi]"
```

### Express 中间件配置
```javascript
import express from "express";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";

const app = express();

// 接收付款的钱包地址
const evmAddress = "0xYourEvmAddress";

// 创建 facilitator 客户端（测试网）
const facilitatorClient = new HTTPFacilitatorClient({
  url: "https://x402.org/facilitator"
});

// 一行代码设置付费墙！
app.use(paymentMiddleware(
  {
    "GET /weather": {
      accepts: [{
        scheme: "exact",
        price: "$0.001",
        network: "eip155:84532",  // Base Sepolia
        payTo: evmAddress,
      }],
      description: "Weather data",
      mimeType: "application/json",
    },
  },
  new x402ResourceServer(facilitatorClient)
    .register("eip155:84532", new ExactEvmScheme())
));
```

### Flask 中间件配置（Python）
```python
from flask import Flask
from x402.flask.middleware import payment_middleware

app = Flask(__name__)

# 一行代码设置付费墙
app.config["X402_PAY_TO"] = "0xYourEvmAddress"
app.config["X402_FACILITATOR_URL"] = "https://x402.org/facilitator"

payment_middleware(app, routes={
    "GET /weather": {
        "price": "$0.001",
        "network": "eip155:84532",
        "description": "Weather data",
    }
})
```

---

## 三、Buyer 端实现（Agent 自主支付）

### 安装依赖
```bash
# Node.js
npm install @x402/fetch @x402/evm

# Python
pip install "x402[httpx]"
```

### Node.js 自动支付
```javascript
import { wrapFetchWithPayment } from "@x402/fetch";
import { privateKeyToAccount } from "viem/accounts";

// 从私钥创建签名者
const signer = privateKeyToAccount(process.env.EVM_PRIVATE_KEY);

// 包装 fetch，自动处理 402 支付
const fetchWithPayment = wrapFetchWithPayment(fetch, signer);

// 使用方式和普通 fetch 完全一样！
const response = await fetchWithPayment("https://api.example.com/weather");
const data = await response.json();
```

### Python 自动支付
```python
import os
from eth_account import Account
from x402.mechanisms.evm import EthAccountSigner
from x402.clients.httpx import x402_httpx_client

# 从私钥创建签名者
account = Account.from_key(os.getenv("EVM_PRIVATE_KEY"))
signer = EthAccountSigner(account)

# 创建自动支付的 HTTP 客户端
async with x402_httpx_client(signer) as client:
    response = await client.get("https://api.example.com/weather")
    data = response.json()
```

---

## 四、CAW（Chain-Aware Wallet）集成

### CAW 的角色
CAW 是 x402 支付闭环中的**链感知钱包层**：

```
x402 协议层（HTTP 语义）
  ↓ 定义"付多少、付给谁"
CAW 执行层（链上支付）
  ↓ 负责"怎么付"
区块链网络
  ↓ 最终结算
```

### CAW 关键功能
1. **多链感知** — 自动识别目标链（Base Sepolia、Solana Devnet 等）
2. **余额检查** — 支付前检查目标链上的 USDC 余额
3. **Gas 管理** — 自动估算和管理 gas 费用
4. **交易签名** — 使用 session key 或 policy 签名交易
5. **收据记录** — 记录交易哈希、金额、时间戳

### CAW 与 x402 的集成流程
```
1. Agent 调用付费 API
2. 收到 402 响应 + 付款要求
3. CAW 解析付款要求：
   - 目标链：eip155:84532 (Base Sepolia)
   - 金额：$0.001 USDC
   - 收款方：0xSellerAddress
4. CAW 检查：
   - 余额是否充足？
   - 是否在预算范围内？
   - 服务方是否在白名单？
5. CAW 签名并提交交易
6. x402 Facilitator 验证交易
7. Server 返回资源
8. CAW 记录收据（交易哈希、金额、时间戳）
```

---

## 五、支付方案（Payment Schemes）

### Exact（精确支付）
- 买家支付**精确金额**
- 最简单的方案
- 适合单次 API 调用

### Upto（上限支付）
- 买家支付**不超过**指定金额
- 适合不确定最终费用的场景
- Server 可以退还差额

### Batch Settlement（批量结算）
- **EVM 微支付的核心方案**
- 多笔小额交易合并为一笔链上交易
- 大幅降低 gas 成本
- 适合高频、小额的 AI Agent 支付

---

## 六、扩展功能

### Bazaar（发现层）
- 服务发现和注册
- Agent 可以自动发现可用的付费服务

### Signed Offers & Receipts
- 签名的报价和收据
- 提供可验证的支付证明
- 适合争议解决场景

### EIP-2612 Gas Sponsoring
- 允许第三方赞助 gas 费
- 降低用户/Agent 的支付门槛

### ERC-20 Approval Gas Sponsoring
- 自动处理 ERC-20 approve
- 减少用户的交互步骤

---

## 七、完整支付闭环设计

### 场景：AI Agent 自主购买数据 API

```
┌─────────────────────────────────────────────────────────┐
│                    用户层面                               │
│  用户授权：今天最多 3 USDC 调用数据 API                    │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    Agent 层面                             │
│  1. Agent 发起请求：GET /market-data                      │
│  2. 收到 402：需要支付 0.1 USDC                           │
│  3. 检查预算：3 USDC > 0.1 USDC ✅                        │
│  4. 检查服务方：在白名单内 ✅                              │
│  5. 使用 x402 fetch 自动支付                              │
│  6. 收到数据 + 收据                                       │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    CAW 层面                               │
│  1. 解析 402 响应：链、金额、收款方                        │
│  2. 检查余额：Base Sepolia USDC 余额充足 ✅               │
│  3. 签名交易（使用 session key）                          │
│  4. 提交到 x402 Facilitator                              │
│  5. 记录收据：txHash, amount, timestamp                   │
│  6. 更新剩余预算：3 - 0.1 = 2.9 USDC                     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    区块链层面                              │
│  - Base Sepolia 上的 USDC 转账                            │
│  - 交易被确认                                              │
│  - Facilitator 验证交易有效性                              │
└─────────────────────────────────────────────────────────┘
```

---

## 八、关键发现与判断

1. **x402 是支付的 HTTP 语义层** — 把"付费才能访问"放回 HTTP 协议里，就像 401 处理登录一样自然

2. **一行代码实现付费墙** — `app.use(paymentMiddleware(...))` 就能让 API 变成付费服务

3. **Agent 友好设计** — `wrapFetchWithPayment(fetch, signer)` 让 Agent 调用付费 API 和免费 API 一样简单

4. **CAW 是执行层** — x402 定义协议，CAW 负责链上执行，两者缺一不可

5. **Batch Settlement 是微支付的关键** — 高频小额支付不适合每笔上链，批量结算大幅降低成本

6. **与 Machine Payment 的关系：**
   - x402 = Quote + Payment Intent 的协议化
   - CAW = Agent Wallet + Budget 的执行层
   - 两者结合 = 完整的 Machine Payment 实现

---

## 九、扩展阅读

- [x402 官方文档](https://docs.x402.org)
- [x402 白皮书](https://www.x402.org/x402-whitepaper.pdf)
- [x402 GitHub](https://github.com/x402-foundation/x402)
- [Coinbase x402 Docs](https://docs.cdp.coinbase.com)
- [MCP Server with x402](https://docs.x402.org/guides/mcp-server)

---

## 学习时长
约 60 分钟（文档阅读 + 概念理解 + 笔记整理）
