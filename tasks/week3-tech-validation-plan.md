# 技术验证计划 — AuditAgent

> 技术栈验证方案 | Z.AI 赛道

---

## 验证目标

在 Week 4 开始前，验证以下核心技术栈的可行性：

| 组件 | 验证目标 | 成功标准 |
|------|----------|----------|
| CrewAI | 5 Agent 可协作运行 | Agent 间能传递消息 |
| Slither | Python 调用可行 | 能输出漏洞报告 |
| MiMo API | 理解 Solidity 代码 | 能分析简单合约 |
| ChromaDB | RAG 检索可用 | 能检索相关漏洞 |
| Foundry | Forge 可运行 | 能执行测试用例 |
| web3.py | 链上交互可行 | 能读取合约状态 |

---

## 验证任务清单

### Task 1: CrewAI 多 Agent 框架

**目标**：验证 5 Agent 可以协作运行

**步骤**：
```bash
# 安装
pip install crewai crewai-tools

# 创建测试 Agent
python -c "
from crewai import Agent, Task, Crew

# 定义 3 个测试 Agent
scanner = Agent(role='Scanner', goal='扫描漏洞', backstory='安全专家')
analyzer = Agent(role='Analyzer', goal='分析漏洞', backstory='分析师')
reporter = Agent(role='Reporter', goal='生成报告', backstory='报告撰写')

# 定义任务
task1 = Task(description='扫描合约漏洞', agent=scanner)
task2 = Task(description='分析漏洞原因', agent=analyzer)
task3 = Task(description='生成审计报告', agent=reporter)

# 运行
crew = Crew(agents=[scanner, analyzer, reporter], tasks=[task1, task2, task3])
result = crew.kickoff()
print(result)
"
```

**成功标准**：
- [ ] 3 个 Agent 能依次执行
- [ ] 消息能在 Agent 间传递
- [ ] 最终输出报告

---

### Task 2: Slither 静态分析

**目标**：验证 Slither 可通过 Python 调用

**步骤**：
```bash
# 安装
pip install slither-analyzer

# 创建测试合约
cat > /tmp/test.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vulnerable {
    mapping(address => uint) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw() public {
        uint bal = balances[msg.sender];
        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");
        balances[msg.sender] = 0;
    }
}
EOF

# 运行分析
slither /tmp/test.sol --json /tmp/report.json
cat /tmp/report.json | python3 -m json.tool
```

**成功标准**：
- [ ] Slither 能检测到 Reentrancy 漏洞
- [ ] 输出 JSON 格式报告
- [ ] 包含漏洞位置和描述

---

### Task 3: MiMo API 调用

**目标**：验证 MiMo 能理解 Solidity 代码

**步骤**：
```python
import requests
import os

API_KEY = os.getenv("MIMO_API_KEY")
URL = "https://api.mimo.com/v1/chat/completions"

prompt = """
分析以下 Solidity 代码中的安全漏洞：

```solidity
function withdraw() public {
    uint bal = balances[msg.sender];
    (bool sent, ) = msg.sender.call{value: bal}("");
    require(sent, "Failed to send Ether");
    balances[msg.sender] = 0;
}
```

请用中文回答，包含：
1. 漏洞类型
2. 漏洞位置
3. 风险等级
4. 修复建议
"""

response = requests.post(URL, headers={"Authorization": f"Bearer {API_KEY}"}, json={
    "model": "mimo-v2.5-pro",
    "messages": [{"role": "user", "content": prompt}]
})

print(response.json()["choices"][0]["message"]["content"])
```

**成功标准**：
- [ ] API 调用成功
- [ ] 能识别 Reentrancy 漏洞
- [ ] 给出正确的修复建议

---

### Task 4: ChromaDB RAG 检索

**目标**：验证 RAG 检索可用

**步骤**：
```python
import chromadb
from chromadb.utils import embedding_functions

# 创建客户端
client = chromadb.Client()
collection = client.create_collection(
    name="vulnerabilities",
    embedding_function=embedding_functions.OpenAIEmbeddingFunction(
        api_key=os.getenv("OPENAI_API_KEY"),
        model_name="text-embedding-3-small"
    )
)

# 添加漏洞知识
collection.add(
    documents=[
        "Reentrancy: 当合约在更新状态前调用外部合约，攻击者可重入函数",
        "Integer Overflow: uint256 溢出导致数值回绕",
        "Unchecked Return: 未检查 low-level call 返回值",
    ],
    ids=["vuln_1", "vuln_2", "vuln_3"]
)

# 检索测试
results = collection.query(
    query_texts=["合约调用外部地址后才更新余额"],
    n_results=2
)

print(results)
```

**成功标准**：
- [ ] ChromaDB 能存储文档
- [ ] 语义检索返回相关结果
- [ ] Reentrancy 排名第一

---

### Task 5: Foundry Forge 测试

**目标**：验证 Forge 可运行测试

**步骤**：
```bash
# 安装 Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 创建测试项目
mkdir forge-test && cd forge-test
forge init

# 编写测试合约
cat > test/Counter.t.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";

contract CounterTest is Test {
    function testFuzz(uint256 x) public pure {
        assertEq(x, x);
    }
    
    function testPass() public pure {
        assertTrue(true);
    }
}
EOF

# 运行测试
forge test -vvvv
```

**成功标准**：
- [ ] Forge 安装成功
- [ ] 能编译测试合约
- [ ] 测试通过

---

### Task 6: web3.py 链上交互

**目标**：验证链上交互可行

**步骤**：
```python
from web3 import Web3

# 连接以太坊
w3 = Web3(Web3.HTTPProvider("https://mainnet.infura.io/v3/YOUR_KEY"))

# 查询区块
latest = w3.eth.block_number
print(f"Latest block: {latest}")

# 查询合约代码（USDT）
usdt_address = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
code = w3.eth.get_code(usdt_address)
print(f"USDT code length: {len(code)} bytes")

# 查询余额
balance = w3.eth.get_balance("0x0000000000000000000000000000000000000000")
print(f"Zero address balance: {w3.from_wei(balance, 'ether')} ETH")
```

**成功标准**：
- [ ] 能连接以太坊节点
- [ ] 能查询区块和合约
- [ ] 能读取合约状态

---

## 验证时间表

| 日期 | 任务 | 预计耗时 |
|------|------|----------|
| 6.07 (周六) | CrewAI + Slither | 3 小时 |
| 6.08 (周日) | MiMo API + ChromaDB | 3 小时 |
| 6.09 (周一) | Forge + web3.py | 2 小时 |

---

## 风险与应对

| 风险 | 应对方案 |
|------|----------|
| API Key 无效 | 申请备用 Key |
| 安装依赖失败 | 使用 Docker 环境 |
| 网络问题 | 使用代理或镜像 |
| 文档不全 | 查看 GitHub Issues |

---

## 验证结果记录

| 组件 | 状态 | 问题 | 解决方案 |
|------|------|------|----------|
| CrewAI | 待验证 | — | — |
| Slither | 待验证 | — | — |
| MiMo API | 待验证 | — | — |
| ChromaDB | 待验证 | — | — |
| Forge | 待验证 | — | — |
| web3.py | 待验证 | — | — |

---

*Z.AI Hackathon | AI × Web3 School Cohort 0*
