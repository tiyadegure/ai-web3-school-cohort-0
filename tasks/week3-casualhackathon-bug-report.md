# Casual Hackathon 网站 Bug 反馈

> 发现时间：2026-06-02
> 页面：https://casualhackathon.com/hackathons/cmpsjubkg0003p80kxuzrdyjy

---

## Bug 1：llms.txt 链接指向 localhost（高优先级）

**文件**：`/llms.txt`

```markdown
# 当前内容（错误）
- [API reference](https://localhost:3000/llms/api.md)
- [Public hackathon index](https://localhost:3000/llms/hackathons.md)
- [AI × Web3 Agentic Builders Hackathon](https://localhost:3000/llms/hackathons/cmpsjubkg0003p80kxuzrdyjy)
- [Browse hackathons](https://localhost:3000/hackathons)

# 应该改为
- [API reference](https://casualhackathon.com/llms/api.md)
- [Public hackathon index](https://casualhackathon.com/llms/hackathons.md)
- [AI × Web3 Agentic Builders Hackathon](https://casualhackathon.com/llms/hackathons/cmpsjubkg0003p80kxuzrdyjy)
- [Browse hackathons](https://casualhackathon.com/hackathons)
```

**影响**：AI Agent 读取 llms.txt 后会访问 localhost 而非实际域名，导致无法获取数据。

---

## Bug 2：hackathons 详情页同样有 localhost 问题

**文件**：`/llms/hackathons/cmpsjubkg0003p80kxuzrdyjy`

```markdown
# 当前内容（错误）
- [Human page](https://localhost:3000/hackathons/cmpsjubkg0003p80kxuzrdyjy)

# 应该改为
- [Human page](https://casualhackathon.com/hackathons/cmpsjubkg0003p80kxuzrdyjy)
```

---

## Bug 3：API 文档完全公开暴露（中优先级）

**文件**：`/llms/api.md`

暴露内容包括：
- 所有 Partner API 端点（GET/POST/PATCH/DELETE）
- 认证方式：Bearer Token（`chp_user_` 前缀）+ x-api-secret（`chp_partner_` 前缀）
- 权限范围：`profile:read`、`registration:read/write`、`project:read/write`、`submission:read/write`、`admin:act_as_user`
- 数据库模型结构（Event、Participation、Project、Submission、Score、Award 等）
- 管理后台逻辑（admin.home、manage.pageState 等 Server Action）
- 错误码格式和处理逻辑

**风险**：攻击者可利用这些信息进行针对性攻击，如权限绕过、数据泄露等。

**建议**：
- 将 API 文档限制为已认证用户可访问
- 或移除 Partner API 的详细实现细节，只保留公开查询接口文档

---

## Bug 4：前端字段未正确渲染（低优先级）

**页面**：`/hackathons/cmpsjubkg0003p80kxuzrdyjy`

前端显示：
- Speakers: Not set
- Sponsors: Not set  
- Rules: Not set

但 `/llms/hackathons/...` 的 Markdown 数据中，这些内容实际存在于 Description、Resources、Prizes 等字段里。

**原因**：可能是前端渲染逻辑没有正确读取或映射这些字段。

---

## 环境信息

- 浏览器：Chrome 125
- 系统：macOS
- 复现方式：直接访问上述 URL

---

*提交任务 ID：cmpukyz7ys1dspo015ksh6u4u*
*提交记录 ID：cmpxub0vzbm47ph01nagrzs09*
