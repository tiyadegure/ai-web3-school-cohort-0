# 部署指南：SimpleCounter 合约（Sepolia 测试网）

## 准备工作
1. 浏览器打开 [Remix IDE](https://remix.ethereum.org)
2. 钱包切换到 **Sepolia 测试网**
3. 确保有 Sepolia ETH（可从 [Sepolia Faucet](https://sepoliafaucet.com) 领取）

## 步骤

### 1. 上传合约
- 在 Remix 左侧创建新文件 `SimpleCounter.sol`
- 粘贴合约代码

### 2. 编译
- 左侧点击 Solidity Compiler（第二个图标）
- Compiler Version: `0.8.20+`
- 点击 **Compile SimpleCounter.sol**
- 确认编译成功（绿色勾）

### 3. 部署
- 左侧点击 Deploy & Run（第三个图标）
- Environment: **Injected Provider - MetaMask**
- 合约选择 `SimpleCounter`
- 点击 **Deploy**
- ⚠️ **人工确认：** MetaMask 弹窗，确认 gas 费用后点确认
- 记录合约地址和交易哈希

### 4. 读取（免费）
- 展开已部署的合约
- 点击 `count` 或 `getCount`
- 结果应显示 `0: uint256: 0`

### 5. 写入（需 gas）
- 点击 `increment`
- ⚠️ **人工确认：** MetaMask 弹窗，确认后点确认
- 再次点击 `count`，结果应显示 `1`

### 6. 验证
- 打开 [Sepolia Etherscan](https://sepolia.etherscan.io)
- 搜索合约地址
- 确认交易记录和合约代码

## 需要人工确认的步骤
1. **部署交易** — 钱包签名确认 gas 费用
2. **increment 写入** — 钱包签名确认 gas 费用
3. **add 写入** — 钱包签名确认 gas 费用

## 不需要人工确认的步骤
1. **编译** — 纯本地操作
2. **读取 count / getCount** — 免费查询，不涉及资产
3. **Etherscan 查看** — 只读操作
