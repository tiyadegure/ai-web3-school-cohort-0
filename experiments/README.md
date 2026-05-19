# AI x Web3 Demo: Transaction Explainer

## What it solves

On-chain data (blocks, transactions, gas) is raw and hard to read. This tool connects to Sepolia testnet, fetches recent blocks, and generates **human-readable summaries** of what's happening — a core pattern in AI x Web3 applications.

## How to interact

```bash
cd experiments
node tx-explainer.mjs
```

The script runs automatically and prints a formatted summary of the last 3 blocks.

## Input → Output

**Input:** No user input needed — the script reads live data from Sepolia RPC.

**Output example:**
```
📝 ETH Transfer
   Sender 0x6cc9...f455 sent 0.360000 ETH to 0x7560...3357. Gas cost: ~0.00000000 ETH.

📝 Contract Call
   Sender 0xbc57...f5cd called a function on contract 0x0820...5ce0. Data size: 1124 bytes. Gas used: 500000.
```

## AI vs Human work

| Part | Who did it |
|------|-----------|
| RPC connection logic | Human (Claude Code assisted) |
| Transaction classification rules | Human-defined |
| Explanatory text templates | Human-defined |
| Code structure and error handling | Claude Code generated |
| README and documentation | Claude Code generated |

## What this demonstrates

- **Chain-aware Context**: Reading on-chain state and converting it to structured context
- **Data → Meaning**: Raw hex values → human-readable explanations
- **Pattern for AI agents**: An AI agent could use this same pattern to monitor on-chain activity and generate reports

## Next steps

Try extending the script to:
1. Filter only ETH transfers over 1 ETH
2. Summarize gas usage patterns across blocks
3. Connect to Mainnet or a different testnet
