# Sponsor SDK / API Integration Plan — AuditAgent

> Z.AI 赛道 | AI × Web3 Agentic Builders Hackathon

---

## 1. 赞助商概况

| 项目 | 内容 |
|------|------|
| 赞助商 | Z.AI |
| 赛道 | Web3 × Long-Horizon Task |
| 核心能力 | GLM-5.1 长程任务能力 |
| API 端点 | https://api.z.ai/api/paas/v4 |
| 认证方式 | Bearer Token |
| Python SDK | zai-sdk（也可用 OpenAI SDK） |

---

## 2. AuditAgent 中的 AI 调用场景

AuditAgent 有 5 个 Agent，每个 Agent 需要 AI 模型支持：

| Agent | 调用场景 | 复杂度 | 推荐模型 |
|-------|----------|--------|----------|
| Auditor | 分析漏洞报告 + 生成审计总结 | 高 | GLM-5.1 |
| Architect | 理解漏洞 + 设计修复方案 | 高 | GLM-5.1 |
| Code Generator | 生成 Solidity 修复代码 | 高 | GLM-5.1 |
| Refiner | 代码优化 + 规范检查 | 中 | GLM-4.7 |
| Validator | 判断验证结果 + 生成报告 | 中 | GLM-4.7 |

---

## 3. 集成方案

### 3.1 SDK 选择

**方案 A：使用 zai-sdk（推荐）**

```bash
pip install zai-sdk
```

```python
from zai import ZaiClient

client = ZaiClient(api_key=os.getenv("ZAI_API_KEY"))

response = client.chat.completions.create(
    model="glm-5.1",
    messages=[
        {"role": "system", "content": "你是智能合约安全审计专家"},
        {"role": "user", "content": "分析以下漏洞：..."}
    ],
    temperature=0.3  # 安全审计需要低随机性
)
```

**方案 B：使用 OpenAI SDK 兼容模式**

```python
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("ZAI_API_KEY"),
    base_url="https://api.z.ai/api/paas/v4/"
)

response = client.chat.completions.create(
    model="glm-5.1",
    messages=[...]
)
```

### 3.2 模型调度策略

```python
def get_model_for_task(task_type: str) -> str:
    """根据任务类型选择模型"""
    model_map = {
        "vulnerability_analysis": "glm-5.1",    # 复杂分析用 GLM-5.1
        "architecture_design": "glm-5.1",       # 架构设计用 GLM-5.1
        "code_generation": "glm-5.1",           # 代码生成用 GLM-5.1
        "code_refinement": "glm-4.7",           # 代码优化用 GLM-4.7（省配额）
        "validation_report": "glm-4.7",         # 报告生成用 GLM-4.7
    }
    return model_map.get(task_type, "glm-4.7")
```

### 3.3 配额管理

根据 Z.AI 文档，配额限制如下：

| 计划 | 5小时限制 | 周限制 |
|------|-----------|--------|
| Lite | ~80 prompts | ~400 prompts |
| Pro | ~400 prompts | ~2,000 prompts |
| Max | ~1,600 prompts | ~8,000 prompts |

**配额优化策略**：

1. **分级调用**：复杂任务用 GLM-5.1，简单任务用 GLM-4.7
2. **缓存机制**：相同输入缓存结果，避免重复调用
3. **批量处理**：合并多个小请求为一个大请求
4. **配额监控**：实时监控剩余配额，接近上限时降级模型

```python
class QuotaManager:
    def __init__(self, daily_limit=100):
        self.daily_limit = daily_limit
        self.used = 0
        self.cache = {}
    
    def call_with_cache(self, model, messages, **kwargs):
        cache_key = hash(str(messages))
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        if self.used >= self.daily_limit:
            model = "glm-4.5-air"  # 降级到最便宜的模型
        
        response = client.chat.completions.create(
            model=model, messages=messages, **kwargs
        )
        self.used += 1
        self.cache[cache_key] = response
        return response
```

---

## 4. 具体集成代码

### 4.1 Z.AI Agent 基类

```python
# src/llm/zai_client.py

import os
from zai import ZaiClient
from typing import Optional

class ZAIClient:
    """Z.AI API 客户端封装"""
    
    def __init__(self):
        self.client = ZaiClient(api_key=os.getenv("ZAI_API_KEY"))
        self.default_model = "glm-5.1"
        self.fallback_model = "glm-4.7"
    
    def chat(
        self,
        system_prompt: str,
        user_prompt: str,
        model: Optional[str] = None,
        temperature: float = 0.3,
        max_tokens: int = 4096
    ) -> str:
        """发送聊天请求"""
        response = self.client.chat.completions.create(
            model=model or self.default_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content
    
    def analyze_vulnerability(self, contract_code: str, slither_report: str) -> str:
        """分析漏洞"""
        system = """你是智能合约安全审计专家。
        分析 Slither 静态分析报告，识别真实漏洞，过滤误报。
        输出 JSON 格式的漏洞列表。"""
        
        user = f"""合约代码：
```solidity
{contract_code}
```

Slither 报告：
```json
{slither_report}
```

请分析并输出漏洞列表（JSON 格式）。"""
        
        return self.chat(system, user, model="glm-5.1")
    
    def generate_fix(self, vulnerability: str, original_code: str) -> str:
        """生成修复代码"""
        system = """你是 Solidity 开发专家。
        根据漏洞描述生成修复代码。
        只输出修复后的完整合约代码。"""
        
        user = f"""漏洞描述：{vulnerability}

原始代码：
```solidity
{original_code}
```

请生成修复后的完整代码。"""
        
        return self.chat(system, user, model="glm-5.1")
```

### 4.2 Agent 集成示例

```python
# src/agents/auditor.py

from src.llm.zai_client import ZAIClient
from src.tools.slither_tool import SlitherTool
from src.tools.rag_tool import RAGTool

class AuditorAgent:
    """审计 Agent - 负责漏洞检测"""
    
    def __init__(self):
        self.llm = ZAIClient()
        self.slither = SlitherTool()
        self.rag = RAGTool()
    
    def audit(self, contract_path: str) -> dict:
        """执行审计"""
        # 1. Slither 静态分析
        slither_report = self.slither.analyze(contract_path)
        
        # 2. RAG 检索相关漏洞模式
        rag_results = self.rag.search(slither_report)
        
        # 3. Z.AI GLM-5.1 深度分析
        contract_code = open(contract_path).read()
        analysis = self.llm.analyze_vulnerability(
            contract_code=contract_code,
            slither_report=slither_report
        )
        
        # 4. 综合结果
        return {
            "slither": slither_report,
            "rag": rag_results,
            "ai_analysis": analysis,
            "vulnerabilities": self._parse_vulnerabilities(analysis)
        }
```

---

## 5. Z.AI 特色功能集成

### 5.1 Web Search MCP

Z.AI 提供 Web Search MCP，可用于搜索最新的漏洞信息：

```python
def search_latest_vulnerabilities(contract_type: str) -> str:
    """搜索最新的合约漏洞"""
    # 通过 Z.AI Web Search MCP 搜索
    response = requests.post(
        "https://api.z.ai/api/paas/v4/tools/web_search",
        headers={"Authorization": f"Bearer {API_KEY}"},
        json={"query": f"latest {contract_type} vulnerability 2026"}
    )
    return response.json()
```

### 5.2 Web Reader MCP

用于读取链上合约源码：

```python
def fetch_contract_source(address: str) -> str:
    """从 Etherscan 获取合约源码"""
    # 通过 Z.AI Web Reader MCP 读取
    response = requests.post(
        "https://api.z.ai/api/paas/v4/tools/web_reader",
        headers={"Authorization": f"Bearer {API_KEY}"},
        json={"url": f"https://etherscan.io/address/{address}#code"}
    )
    return response.json()
```

---

## 6. 成本估算

| 场景 | 每次调用 Token | 每天调用次数 | 每月成本（估算） |
|------|----------------|--------------|------------------|
| 漏洞分析 | ~2,000 | 50 | ~$30 |
| 代码生成 | ~3,000 | 30 | ~$45 |
| 报告生成 | ~1,000 | 20 | ~$10 |
| **总计** | — | 100 | **~$85/月** |

> 注：使用 GLM-4.7 处理简单任务可降低 30% 成本

---

## 7. 集成时间表

| 日期 | 任务 | 产出 |
|------|------|------|
| 6.09 | 环境搭建 + SDK 测试 | zai-sdk 可用 |
| 6.10 | ZAIClient 封装 | 基础调用接口 |
| 6.11 | 5 Agent 集成 | Agent 可调用 GLM-5.1 |
| 6.12 | 配额管理 + 缓存 | 优化调用成本 |
| 6.13 | MCP 功能集成 | Web Search/Reader 可用 |

---

## 8. 验证清单

- [ ] zai-sdk 安装成功
- [ ] API Key 配置正确
- [ ] GLM-5.1 能理解 Solidity 代码
- [ ] GLM-5.1 能生成正确的修复代码
- [ ] 模型切换正常（GLM-5.1 ↔ GLM-4.7）
- [ ] 配额监控正常
- [ ] 缓存命中率 > 20%

---

## 9. 参考资料

- Z.AI 开发者文档：https://docs.z.ai/devpack/overview
- API 接入指南：https://docs.z.ai/api-reference/introduction
- GLM-5.1 技术报告：https://z.ai/blog/glm-5.1
- Python SDK：`pip install zai-sdk`
- API 补贴申请：https://docs.google.com/forms/d/e/1FAIpQLSdPXXZBoos9CsP2vA_rmD6blm7a-cvAsJ6XdVvLCjepY0sNrg/viewform

---

*Z.AI Hackathon | AI × Web3 School Cohort 0*
