const axios = require("axios");
const crypto = require("crypto");
const { performance } = require("perf_hooks");

const SERVER_URL = "http://localhost:3000/api/authorize";
const TEST_WALLET = "0xC250F090ddE2d7B9041c257d973C1b4112469485";

const ITERATIONS = 20;
const DELAY_MS = 1000; // Wait 1 second between requests

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runBenchmark() {
  console.log(`Starting Benchmark (${ITERATIONS} iterations)...`);
  console.log("--------------------------------------------------");
  console.log("Run\t| Net+Bridge (ms)\t| Vault Derivation (ms)");
  console.log("--------------------------------------------------");

  const rttResults = [];
  const vaultResults = [];

  for (let i = 1; i <= ITERATIONS; i++) {
    // 1. Measure Network + Bridge
    const startNet = performance.now();
    try {
      await axios.post(SERVER_URL, {
        walletAddress: TEST_WALLET,
        tokenId: 1,
      });
    } catch (e) {
      // Ignore 403 errors, we just want the timing
    }
    const endNet = performance.now();
    const rtt = (endNet - startNet).toFixed(2);
    rttResults.push(parseFloat(rtt));

    // 2. Measure Vault Derivation
    const startVault = performance.now();
    const hmac = crypto.createHmac("sha256", "secret_key");
    hmac.update("simulation_payload");
    hmac.digest("hex");
    const endVault = performance.now();
    const vaultTime = (endVault - startVault).toFixed(4);
    vaultResults.push(parseFloat(vaultTime));

    // Log row
    console.log(`${i}\t| ${rtt}\t\t| ${vaultTime}`);

    // Wait before next run
    await sleep(DELAY_MS);
  }

  console.log("--------------------------------------------------");
  console.log("Benchmark Complete.");
  console.log("\nRAW DATA FOR GRAPH (Copy these arrays):");
  console.log(`RTT_Times = [${rttResults}]`);
  console.log(`Vault_Times = [${vaultResults}]`);
}

runBenchmark();
