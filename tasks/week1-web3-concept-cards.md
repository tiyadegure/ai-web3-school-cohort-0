# Week 1 -- Web3 Concept Cards

> Source: [AI x Web3 School Handbook](https://aiweb3.school/zh/handbook/web3/) -- 10 core chapters
> Generated: 2026-05-19

---

## 1. Cryptography (密码学)

**Main concept:** The mathematical foundation underpinning all Web3 accounts, signatures, addresses, and ownership -- not abstract theory, but the product boundary of who controls what.

**One-line definition:** Private keys control assets, signatures prove authorization, hashes commit data, and Merkle Trees enable efficient verification of large datasets.

**Key points:**
- **Hash** -- maps arbitrary data to a fixed-length fingerprint; used to verify integrity, not to encrypt. A single character change in input produces a completely different output.
- **Public Key** -- can be shared openly; used to derive addresses and verify signatures. Cannot be reverse-engineered to reveal the private key.
- **Private Key** -- IS the account control itself. Once leaked, attackers can transfer assets or authorize malicious contracts. No recovery mechanism exists like traditional password resets.
- **Signature** -- cryptographic proof that a specific account authorized a specific message or transaction. Products must display human-readable content (domain, amount, contract address, expiry).
- **Merkle Tree** -- organizes large datasets via layered hashing into a single root. Enables efficient verification (e.g., airdrop eligibility) without downloading all data.

**AI x Web3 connection:** AI Agents that explain transactions, judge authorizations, or help manage permissions must understand signature and key boundaries. Models can explain "this approval grants a token spending limit" but must never hold private keys or push signatures when users don't understand content. AI outputs themselves may need to be signed/hashed for audit trails.

---

## 2. Wallet (钱包)

**Main concept:** Not a "login button" for Web3, but the user's interface for managing accounts, signing authorizations, sending transactions, switching networks, and confirming risk -- the last confirmation boundary before on-chain execution.

**One-line definition:** Wallet manages on-chain control权 (not "account profiles"); connecting is not authorizing assets.

**Key points:**
- **EOA (Externally Owned Account)** -- the most common wallet type, controlled by a private key. Simple, universal, but limited: lost keys mean lost control, permissions are coarse, and automation is weak.
- **Mnemonic** -- a recovery phrase for wallet private keys; an extremely high-risk secret. Any webpage, customer service, AI Agent, or form requesting your mnemonic should be treated as dangerous.
- **Transaction** -- a formal request to change on-chain state. Once confirmed, results cannot be rolled back like database records. The button click is just the request; the transaction goes through wallet confirmation, signing, broadcasting, packaging, and execution.
- **Gas** -- the on-chain execution cost. Products must show estimated fees, payment asset, whether fees are consumed on failure, and retry options.
- **Explorer** -- the public window for viewing on-chain facts (addresses, transactions, contracts, events). Not the chain itself, but the verification tool.

**AI x Web3 connection:** AI Agents that want to execute on-chain will hit the wallet boundary. Reasonable design: AI does understanding and preparation, the wallet handles confirmation and authorization, strategy contracts or smart accounts enforce execution constraints. Users get AI efficiency while retaining control over assets and permissions.

---

## 3. Smart Contract (智能合约)

**Main concept:** Programs deployed on-chain that put rules, assets, and state into a publicly verifiable execution environment -- and expose errors, permissions, and upgrade risks to everyone.

**One-line definition:** Smart contracts turn rules into public infrastructure and bugs into public risk.

**Key points:**
- **Solidity** -- the most common EVM contract language. Key chain-specific concepts: storage, msg.sender, modifiers, events, external calls, reverts, and access control.
- **EVM (Ethereum Virtual Machine)** -- the execution environment for contracts. Explains why gas exists, why storage is expensive, why external calls carry risk, and why the same contract can deploy to multiple EVM-compatible chains.
- **ABI (Application Binary Interface)** -- the interface description for how applications communicate with contracts. ABI tells you what CAN be called, but NOT whether calling it is safe.
- **Event** -- indexed logs that contracts emit for external systems to track what happened (transfers, order creation, parameter updates). Critical for frontend history, dashboards, and auditing.
- **Upgrade** -- the tradeoff between security, governance, and product iteration. Questions: who holds upgrade authority? Can users see upgrade proposals? Could upgrades change asset transfer/withdrawal logic?

**AI x Web3 connection:** When AI Agents execute on-chain, smart contracts should enforce final rules and constraints -- not delegate all judgment to the model. Recommended architecture: AI does suggestions and orchestration, wallet handles authorization, contracts provide verifiable execution, monitoring systems record results.

---

## 4. Dev Stack (开发栈)

**Main concept:** Not a random collection of tool names, but an engineering pipeline from writing, testing, deploying contracts, connecting wallets, calling contracts, to monitoring results -- tool selection aims to make on-chain development more verifiable, reproducible, and accident-free.

**One-line definition:** The clearer the toolchain, the more controllable the on-chain execution.

**Key points:**
- **Remix** -- browser-based Solidity IDE for quick prototyping, compilation, deployment, and debugging. The "contract experiment bench" -- low barrier but not suitable for long-term engineering repos.
- **Hardhat** -- JavaScript/TypeScript-oriented contract engineering framework with local dev network, testing, deployment scripts, and plugin ecosystem. Natural fit for teams already using TypeScript and CI.
- **Foundry** -- command-line and Solidity-native testing tools (forge, cast, anvil). Fast feedback, supports fuzz testing. Especially good for training "write tests first, then modify contracts."
- **OpenZeppelin** -- standard contract libraries (ERC-20, ERC-721, AccessControl, etc.). Reduces boilerplate but does NOT replace auditing -- permission combinations, upgrade patterns, and economic design still need review.
- **viem / wagmi** -- frontend-to-chain interaction libraries. viem provides type-safe TypeScript Ethereum interface; wagmi offers React hooks for wallet connection, account state, and contract read/write.

**AI x Web3 connection:** AI can significantly boost Web3 development efficiency (explaining ABIs, generating deployment scripts, writing tests, debugging transactions), but verification processes must become MORE explicit when AI participates. High-risk commands need human confirmation.

---

## 5. Network (网络)

**Main concept:** Not an abstract background, but the fundamental environment determining whether transactions get packaged, state gets synchronized, fees are generated, confirmation times, and how L2 and mainnet divide responsibilities.

**One-line definition:** On-chain apps don't write to databases directly -- they submit requests to a public, block-by-block, consensus-maintained state machine.

**Key points:**
- **Block** -- the unit where transactions are batched and ordered. Key insight: transaction ordering matters, blocks have gas limits, and new blocks reference previous ones forming verifiable history.
- **Consensus** -- the mechanism by which nodes agree on which history is valid. Impacts confirmation count needed, possible short-term reorgs, and delayed state reads during node failures.
- **PoS (Proof of Stake)** -- uses staking and penalties to organize validators (replacing PoW mining). Network security comes from economic staking, client implementations, and node participation.
- **Testnet** -- for testing contracts, frontends, and transaction flows in a near-real environment. Testnet assets have no real economic value; cannot substitute for mainnet security auditing.
- **L2 / Rollup** -- execute transactions off mainnet, submit results/proofs back. Lower fees and faster confirmation, but adds complexity: bridges, withdrawal delays, sequencers, cross-chain state sync.

**AI x Web3 connection:** AI Agents reading on-chain state or executing transactions MUST know which network they're operating on. Mainnet vs testnet, L1 vs L2, different chain IDs, different contract addresses -- these cannot be "guessed" by the model. Structured network info (chain ID, RPC source, block height, explorer links) should be returned by tools, not generated by the model.

---

## 6. Account Abstraction (账户抽象)

**Main concept:** Breaks the fixed EOA model by letting accounts define their own verification logic and execution policies -- turning wallets into programmable account systems.

**One-line definition:** Account abstraction extends account control from a single private key to programmable rules.

**Key points:**
- **ERC-4337** -- the most important AA standard in the Ethereum ecosystem. Uses an alt mempool and EntryPoint to implement smart account transaction flows via UserOperation, Bundler, EntryPoint, and Paymaster.
- **Smart Account** -- a contract-controlled account that can enforce multi-sig for large transfers, auto-approve small transactions, set per-dApp spending limits, social recovery, and batch execution. Risk increases: contract bugs, module permissions, and upgrade logic become account risks.
- **Bundler** -- collects UserOperations, simulates validation, and submits to the EntryPoint. Infrastructure dependency: if Bundler is unstable, user operations may get stuck.
- **Paymaster** -- allows third parties to pay gas for users, or lets users pay with non-native assets. Critical for onboarding (new users without ETH). Requires risk control: method whitelisting, per-user limits, spam prevention.
- **Session Key** -- temporary permissions for apps or Agents: time-limited, contract-specific, method-restricted, amount-capped, chain-bound. The key foundation for Agent Wallets.

**AI x Web3 connection:** Account Abstraction is the critical infrastructure for AI Agent on-chain execution. Without it, Agents are limited to "give advice" or "make users sign every step." With Smart Accounts, Paymaster, and Session Keys, Agents can auto-execute within constrained scopes. But more automation requires clearer policies: what can be called, spending limits, expiration, revocation, logging, and failure handling.

---

## 7. DeFi (去中心化金融)

**Main concept:** Open financial systems built on smart contracts -- enabling assets, trading, lending, stablecoins, and liquidity to be protocol-composited, while also propagating risk along protocol dependency chains.

**One-line definition:** DeFi's core is not "removing intermediaries" but making financial rules composable, verifiable, and also attackable on-chain protocols.

**Key points:**
- **Token** -- the asset unit of DeFi. ERC-20 is the most common standard. Never just look at name/icon; check contract address, decimals, total supply, mint authority, pause/freeze capability, and transfer tax/blacklist logic.
- **AMM (Automated Market Maker)** -- uses liquidity pools and pricing formulas instead of order books. Key concepts: slippage (expected vs actual price), impermanent loss for LPs, price impact from large trades, MEV/sandwich attack risk.
- **Lending** -- protocols encoding deposits, borrowing, collateral ratios, interest rates, and liquidation rules into contracts. Risk is often multi-factor: collateral price drops, oracle delays, insufficient liquidity for liquidation, parameter misconfiguration, dependent asset de-pegging.
- **Stablecoin** -- the pricing and settlement foundation of DeFi. "Stability" comes from different mechanisms (fiat reserves, over-collateralized crypto, algorithmic, hybrid), each with different risks.
- **Liquidity** -- determines whether assets can be bought, sold, borrowed, liquidated, or exited at reasonable prices. Without liquidity support, "price" is just a number on screen.

**AI x Web3 connection:** AI entering DeFi is best suited first for information aggregation and risk assistance: explaining trades, summarizing positions, monitoring liquidation, identifying abnormal prices, generating strategy drafts. High-risk territory is automated execution (swap, lending, leverage, cross-chain). If an Agent executes DeFi operations, it needs: spending limits, protocol whitelists, slippage caps, simulation results, oracle checks, human confirmation, and post-trade audit records.

---

## 8. Oracle (预言机)

**Main concept:** The bridge bringing off-chain data (prices, weather, game results, reserves, randomness, computation results) into on-chain contracts in a usable format -- since blockchains cannot natively know what happens in the outside world.

**One-line definition:** An Oracle is not a "real-world API" but a data submission and verification mechanism that on-chain contracts choose to trust.

**Key points:**
- **Price Feed** -- the most common Oracle form, providing asset prices for collateral ratios, liquidation thresholds, swap limits, borrowing capacity, and net asset value. Must check: asset pair, decimals, update freshness, anomaly values, and correct feed address.
- **Data Feed** -- extends beyond prices to reserves, interest rates, macro data, sports results, or any off-chain information. Same questions apply: where does data come from, how is it updated, who submits it, is it verifiable, what happens on error.
- **Oracle Risk** -- systemic risk from off-chain data entering on-chain execution: data source manipulation, feed update delays, aggregation node offline, decimal/unit misunderstanding, low-liquidity asset price attacks, stale price checks missing, opaque upgrade/permission changes.
- **AI Oracle** -- the frontier of submitting model inference, scoring, classification, or generation results on-chain. More complex than price feeds because AI output is not a simple objective number. Requires: input traceability, model version/prompt recording, output reproducibility, challenge/arbitration mechanisms.

**AI x Web3 connection:** Oracle is a critical bridge for AI x Web3. AI Agents need to read on-chain and off-chain data; contracts wanting to use AI results need to convert model output into on-chain verifiable or disputable data. But don't think of AI Oracle as "whatever the model says, the contract executes." Better approach: AI provides results, system records source and confidence, high-risk scenarios introduce human-in-the-loop, challenge periods, multi-person verification, or economic penalties.

---

## 9. Indexing (索引)

**Main concept:** Organizing blocks, transactions, events, and contract states into structured data that products, analytics tools, and AI Agents can quickly query -- because on-chain data being public does not mean it's usable.

**One-line definition:** The chain is the source of truth; the indexing layer is the usable data layer.

**Key points:**
- **Event Indexing** -- listening to contract logs and organizing on-chain actions into queryable records. Design considerations: does the event contain key addresses? Indexed parameters? Can business state be reconstructed from events? Failed transactions don't produce success events. Contract upgrades must be event-compatible.
- **Subgraph** -- declarative description of how to index contract events via The Graph, exposing queries through GraphQL. Includes: contract/event listeners, entity mappings, and GraphQL schema. Still requires maintenance for address changes, event structure changes, reorgs, sync delays, and schema design.
- **RPC** -- the interface between applications and nodes for reading chain state, querying logs, estimating gas, and sending transactions. NOT a universal indexing service; public RPCs easily rate-limit or slow down with heavy historical log scanning.
- **Data Pipeline** -- combines on-chain data, off-chain data, indexing results, and business events into analyzable, monitorable, AI-usable data systems. May include: RPC sources, event listeners, ABI decoding, DB writes, reorg handling, data validation, API/GraphQL/vector stores, dashboards, alerts, and Agent context.

**AI x Web3 connection:** AI Agents need context, and on-chain context usually comes from the indexing layer. Transaction histories, contract events, user positions, protocol states, risk signals -- none are suitable for ad-hoc searching through raw blocks. A good indexing layer provides Agents with structured, sourced, timestamped, traceable data. The model handles interpretation and reasoning; the indexing layer provides facts.

---

## 10. Security (安全)

**Main concept:** Not a one-time pre-launch code audit, but an end-to-end engineering process spanning contract design, permissions, testing, transaction simulation, monitoring, emergency pause, and permission revocation.

**One-line definition:** Web3 security core is not "no bugs" but blocking foreseeable risks before execution and enabling rapid detection and damage control after.

**Key points:**
- **Reentrancy** -- a classic vulnerability where a contract is called again before its external call completes, allowing state to be exploited repeatedly. Defense: Checks-Effects-Interactions pattern, reentrancy guards, avoid calling untrusted contracts before state updates.
- **Access Control** -- determines who can execute sensitive actions (mint, burn, pause, upgrade, withdraw, set parameters). Must check: is owner EOA/multisig/DAO? Is there a timelock? Can roles grant each other? Are permission changes emitted as events? What's the worst case if private keys leak?
- **Audit** -- external security review, NOT a security guarantee. Covers design, implementation, and testing issues, but scope, code versions, deployment parameters, upgrade permissions, and post-audit changes all affect conclusions.
- **Simulation** -- pre-execution rehearsal detecting failure, abnormal asset changes, and permission violations before a user or Agent signs. Catches wrong chain ID, wrong contract address, abnormal approval amounts, excessive slippage, insufficient balance, and method mismatches.
- **Monitoring** -- post-launch security awareness layer. Watches: large transfers, admin permission changes, contract upgrades, oracle price anomalies, high failure rates, rapid TVL outflows, unexpected events, and Agent high-risk tool triggers. Effective security = monitoring + response protocol.

**AI x Web3 connection:** AI makes security boundaries more complex. Agents can explain contracts, generate transactions, call tools, and execute strategies -- but they can also misread context, fall victim to prompt injection, call wrong tools, or generate dangerous transactions. Security design must separate model output from on-chain execution: model suggests, tools return facts, policies restrict permissions, simulation previews results, human checks confirm high-risk actions, monitoring records execution consequences.

---

## Quick Reference: How All 10 Concepts Connect

```
Cryptography  -->  Wallet  -->  Smart Contract  -->  Dev Stack
   (keys,           (connect,       (on-chain         (Remix, Hardhat,
    signatures,      sign, send)     rules & state)    Foundry, OZ)
        |                |                |                |
        v                v                v                v
   Network  <--->  Account Abstraction  <--->  DeFi
   (blocks,         (programmable        (tokens, AMM,
    consensus,       accounts,           lending,
    L2, PoS)         session keys)       stablecoins)
        |                |                |
        v                v                v
   Oracle  -->  Indexing  -->  Security
   (off-chain      (structured     (reentrancy,
    data bridge)    data layer)     access control,
                                    simulation,
                                    monitoring)
```
