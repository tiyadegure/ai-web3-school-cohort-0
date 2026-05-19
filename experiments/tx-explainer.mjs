#!/usr/bin/env node
/**
 * AI x Web3 Demo: Transaction Explainer
 *
 * Connects to Ethereum Sepolia testnet, fetches recent blocks,
 * and generates human-readable summaries of on-chain activity.
 *
 * This demonstrates the "Chain-aware Context" pattern:
 * raw on-chain data → structured context → human-readable explanation
 */

const SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com";

async function ethCall(method, params = []) {
  const res = await fetch(SEPOLIA_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

function weiToEth(weiHex) {
  const wei = BigInt(weiHex);
  const eth = Number(wei) / 1e18;
  return eth.toFixed(6);
}

function shortenAddr(addr) {
  if (!addr) return "(contract creation)";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function classifyTx(tx) {
  if (!tx.to) return "Contract Deployment";
  if (tx.input && tx.input !== "0x") return "Contract Call";
  const value = BigInt(tx.value || "0x0");
  if (value > 0n) return "ETH Transfer";
  return "Zero-value Call";
}

function explainTx(tx, block) {
  const type = classifyTx(tx);
  const value = weiToEth(tx.value || "0x0");
  const gasUsed = parseInt(tx.gas, 16);
  const gasPrice = weiToEth(tx.gasPrice || "0x0");
  const gasCost = (gasUsed * parseFloat(gasPrice)).toFixed(8);

  let explanation = "";
  switch (type) {
    case "ETH Transfer":
      explanation =
        `Sender ${shortenAddr(tx.from)} sent ${value} ETH to ${shortenAddr(tx.to)}. ` +
        `Gas cost: ~${gasCost} ETH.`;
      break;
    case "Contract Call":
      explanation =
        `Sender ${shortenAddr(tx.from)} called a function on contract ${shortenAddr(tx.to)}. ` +
        `Data size: ${(tx.input.length - 2) / 2} bytes. Gas used: ${gasUsed}.`;
      break;
    case "Contract Deployment":
      explanation =
        `Sender ${shortenAddr(tx.from)} deployed a new contract. ` +
        `Gas used: ${gasUsed}. Contract address will be in receipt.`;
      break;
    default:
      explanation = `Transaction from ${shortenAddr(tx.from)} to ${shortenAddr(tx.to)}.`;
  }

  return {
    hash: tx.hash,
    type,
    from: tx.from,
    to: tx.to,
    value: `${value} ETH`,
    gasUsed,
    gasCost: `${gasCost} ETH`,
    blockNumber: parseInt(block, 16),
    explanation,
  };
}

async function main() {
  console.log("🔗 AI x Web3 Demo: Transaction Explainer\n");
  console.log("Connecting to Sepolia testnet...\n");

  // Get latest block number
  const latestBlockHex = await ethCall("eth_blockNumber");
  const latestBlock = parseInt(latestBlockHex, 16);
  console.log(`Latest block: #${latestBlock}\n`);

  // Fetch last 3 blocks and their transactions
  for (let i = 0; i < 3; i++) {
    const blockNum = `0x${(latestBlock - i).toString(16)}`;
    const block = await ethCall("eth_getBlockByNumber", [blockNum, true]);

    console.log(`━━━ Block #${parseInt(block.number, 16)} ━━━`);
    console.log(`Timestamp: ${new Date(parseInt(block.timestamp, 16) * 1000).toISOString()}`);
    console.log(`Transactions: ${block.transactions.length}`);
    console.log(`Miner: ${shortenAddr(block.miner)}\n`);

    // Show first 3 transactions
    const txs = block.transactions.slice(0, 3);
    for (const tx of txs) {
      const result = explainTx(tx, block.number);
      console.log(`  📝 ${result.type}`);
      console.log(`     ${result.explanation}`);
      console.log(`     Hash: ${tx.hash.slice(0, 16)}...`);
      console.log();
    }

    if (block.transactions.length > 3) {
      console.log(`  ... and ${block.transactions.length - 3} more transactions\n`);
    }
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Demo complete. This tool converts raw on-chain data");
  console.log("   into human-readable explanations — a core pattern in AI x Web3.");
  console.log("\nTry modifying the code to:");
  console.log("  1. Filter only ETH transfers");
  console.log("  2. Summarize gas usage patterns");
  console.log("  3. Connect to a different testnet");
}

main().catch(console.error);
