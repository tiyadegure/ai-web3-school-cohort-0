# Week 1 -- AI Concept Cards

> Source: [AI x Web3 School Handbook](https://www.aiweb3.school/) -- 8 core chapters
> Generated: 2026-05-19

---

## 1. LLM (大语言模型)

**Main concept:** A probability model that compresses massive text, code, and multimodal signals into model parameters -- not an all-knowing oracle.

**One-line definition:** LLM generates statistically plausible output, not inherently truthful facts.

**Key points:**
- **Token** -- the smallest unit of text the model processes; token count directly impacts cost and context budget
- **Embedding** -- maps tokens into high-dimensional vectors so the model can capture semantic relationships
- **Transformer** -- the architecture behind LLMs; uses self-attention to weigh which tokens matter to each other
- **Hallucination** -- the model produces confident but false output; a structural risk, not a random bug
- **Multimodal** -- modern LLMs can process text, images, audio, and video, not just text

**AI x Web3 connection:** On-chain data (transactions, contract states, token prices) can be converted into embeddings and fed as context to LLMs, enabling AI agents that reason about blockchain state. The data layer (RPC nodes, indexers, oracles) is where Web3 meets the model's information pipeline.

---

## 2. Prompt (提示词)

**Main concept:** The interface design between user and model -- a communicable protocol that encodes task goals, input boundaries, output format, failure handling, and safety rules into a single executable exchange.

**One-line definition:** Prompt is a soft constraint, not a security boundary; real boundaries must be enforced by code, permissions, validation, and audit.

**Key points:**
- **Instruction** -- the core directive telling the model what to do, how to behave, and what to avoid
- **Few-shot** -- providing examples in the prompt to guide the model's output pattern without retraining
- **Structured Output** -- constraining the model to return JSON, tables, or other well-defined formats for downstream use
- **Prompt Injection** -- malicious input that overrides or bypasses the original prompt instructions; a real attack vector in production

**AI x Web3 connection:** When building AI tools for Web3 (trading assistants, wallet interpreters), prompt design must include safety rules that prevent the agent from signing unintended transactions or leaking private keys. Prompt injection is especially dangerous when the model interacts with on-chain actions.

---

## 3. Context (上下文)

**Main concept:** The information space that the model can see, use, or be influenced by in a given interaction.

**One-line definition:** The model can only act on what it sees in context; the system decides what enters context, with what identity, and how it expires.

**Key points:**
- **Context Window** -- the maximum number of tokens the model can process in one turn; a hard resource constraint
- **Context Engineering** -- deliberately designing what goes into the context window to maximize task performance
- **Memory** -- persisting information across turns or sessions; can be short-term (conversation) or long-term (stored externally)
- **Knowledge Base** -- an external, curated source of information the model can query beyond its training data

**AI x Web3 connection:** Web3 context is vast -- wallet histories, on-chain governance votes, token metadata. Context engineering determines which on-chain data to inject into the model's window. On-chain oracles and indexers serve as the "knowledge base" layer, providing real-time blockchain data to the model.

---

## 4. RAG (检索增强生成)

**Main concept:** An evidence chain that retrieves, filters, cites, and passes external knowledge to the model -- reducing outdated information and unsupported answers.

**One-line definition:** RAG reliability depends on the evidence chain, not on the vector database itself.

**Key points:**
- **Chunking** -- splitting documents into meaningful segments for indexing; chunk quality directly affects retrieval accuracy
- **Vector Database** -- stores embeddings for semantic search; the retrieval backbone of RAG systems
- **Retriever** -- the component that searches the knowledge base and returns relevant passages given a query
- **Rerank** -- a second-pass model that re-scores retrieved results for higher precision before they reach the LLM
- **Citation** -- tracing generated answers back to source passages; essential for trust and verification

**AI x Web3 connection:** RAG is critical for Web3 AI agents that need to reference on-chain data, smart contract documentation, or governance proposals. A well-built RAG pipeline can pull from blockchain explorers, contract ABIs, and protocol docs to give the model grounded, verifiable answers instead of hallucinated ones.

---

## 5. Agent (智能体)

**Main concept:** An AI system that continuously calls tools, reads state, and adjusts steps around goals -- its power lies not in "being human" but in executing within clear permissions and auditable workflows.

**One-line definition:** An Agent is a constrained execution loop; goals, tools, state, permissions, and stop conditions are all required.

**Key points:**
- **Tool Use** -- the agent's ability to call external functions (APIs, databases, blockchain RPCs) to take real-world actions
- **Planning** -- breaking a complex goal into subtasks and deciding execution order, including retries and fallbacks
- **State** -- tracking what has happened so far in the workflow; enables multi-step reasoning and recovery
- **Reflection** -- the agent's ability to evaluate its own output and adjust strategy when things go wrong
- **Multi-Agent** -- multiple specialized agents collaborating, each handling a piece of a larger workflow

**AI x Web3 connection:** AI agents in Web3 can execute on-chain transactions, manage wallets, participate in governance, and monitor smart contracts. The execution layer (wallets, smart accounts, contract interaction) is where agents turn reasoning into blockchain actions. The security layer (guards, simulation, permission controls) is essential to prevent costly mistakes.

---

## 6. Frameworks (框架)

**Main concept:** Organizing models, tools, state, retrieval, evaluation, and deployment into a maintainable system -- not just writing fewer API calls.

**One-line definition:** Frameworks express system boundaries, not intelligence itself. Understand the workflow first, then decide whether a framework is needed.

**Key points:**
- **LangChain** -- the original LLM application framework; provides composable chains, agents, and integrations for building AI pipelines
- **LangGraph** -- extends LangChain with state machine graphs for complex, branching agent workflows
- **OpenAI Agents SDK** -- a lightweight, opinionated framework from OpenAI for building agents with tool use and guardrails
- **DSPy** -- a programming framework that treats prompts as optimizable programs rather than hand-crafted templates

**AI x Web3 connection:** Frameworks provide the orchestration layer for AI x Web3 applications. LangGraph or OpenAI Agents SDK can wire together on-chain data retrieval, prompt construction, tool calling (e.g., signing transactions), and evaluation -- turning separate components into a production-grade pipeline.

---

## 7. MCP (模型上下文协议)

**Main concept:** Standardizing connections between models and external tools, data sources, and application context -- solving how models use external capabilities in a describable, reusable, and manageable way.

**One-line definition:** The model should not directly own the world; it should access authorized context and tools through explicit protocols.

**Key points:**
- **Server** -- the side that exposes tools, data, and context to the model; each server manages its own domain of capabilities
- **Client** -- the side that connects the model to servers; handles discovery, negotiation, and request routing
- **Tool Schema** -- structured descriptions of what a tool does, its inputs, and its outputs -- so the model can decide when and how to use it
- **Permission** -- controls what the model is allowed to access and do through a server; critical for safety and trust

**AI x Web3 connection:** MCP is the missing plumbing layer for AI x Web3. An MCP server could expose on-chain data (token prices, wallet balances, governance votes) or on-chain actions (sending transactions, deploying contracts) as standard tools. This lets any MCP-compatible AI agent interact with blockchain infrastructure without custom integration work per chain.

---

## 8. Evaluation (评估)

**Main concept:** Turning "it feels like it works" into "the system can sustainably improve" through repeatable measurement.

**One-line definition:** AI behavior that cannot be repeatedly measured cannot be stably improved.

**Key points:**
- **Test Harness** -- the infrastructure that runs evaluations: loads test cases, invokes the model, and collects results consistently
- **Golden Set** -- a curated set of high-quality input-output pairs that serve as the ground truth for measuring performance
- **LLM-as-Judge** -- using a strong model to evaluate the output of another model; scalable but requires careful calibration
- **Regression Testing** -- re-running evaluations after every change to catch performance degradation before it reaches users
- **Observability** -- monitoring real-world model behavior in production; capturing latency, errors, and user feedback

**AI x Web3 connection:** In Web3 AI applications, evaluation must cover both traditional AI metrics (accuracy, relevance) and domain-specific ones (did the agent sign the correct transaction? did it correctly interpret on-chain data?). Regression testing is especially important when both the AI model and the blockchain state are constantly changing.

---

## How the 8 Concepts Connect

```
  LLM (base model)
    |
  Prompt (interface design)
    |
  Context (information space)
    |
  RAG (evidence chain)  <-->  Knowledge Base
    |
  Agent (execution loop)
    |
  Frameworks (system organization)
    |
  MCP (protocol layer)
    |
  Evaluation (feedback loop)
```

The full stack for an AI x Web3 application:
1. **Data layer**: RPC nodes, indexers, oracles feed on-chain data into the system
2. **Orchestration layer**: Prompt, Context, RAG, and Agent coordinate reasoning and action
3. **Execution layer**: Wallets, smart accounts, and contract interactions carry out on-chain operations
4. **Security layer**: Guards, simulation, and permission controls protect against harmful actions
5. **Protocol layer**: MCP standardizes how models connect to external capabilities
6. **Improvement layer**: Evaluation provides the feedback loop for sustainable quality
