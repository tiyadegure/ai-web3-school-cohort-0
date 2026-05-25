// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title SimpleCounter
/// @notice 一个最小的计数器合约，用于学习合约部署和读写操作
/// @dev 部署在 Sepolia 测试网，无实际资产风险
contract SimpleCounter {
    uint256 public count;
    address public owner;
    
    // 记录每次操作
    event CountChanged(address indexed caller, uint256 oldValue, uint256 newValue, uint256 timestamp);
    
    constructor() {
        count = 0;
        owner = msg.sender;
    }
    
    /// @notice 读取当前计数（免费，不需要 gas）
    function getCount() external view returns (uint256) {
        return count;
    }
    
    /// @notice 计数器加 1（需要 gas，需要钱包签名）
    function increment() external {
        uint256 oldValue = count;
        count += 1;
        emit CountChanged(msg.sender, oldValue, count, block.timestamp);
    }
    
    /// @notice 计数器加指定值（需要 gas，需要钱包签名）
    function add(uint256 value) external {
        require(value > 0, "Value must be positive");
        uint256 oldValue = count;
        count += value;
        emit CountChanged(msg.sender, oldValue, count, block.timestamp);
    }
}
