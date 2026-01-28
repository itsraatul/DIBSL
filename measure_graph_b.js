const crypto = require("crypto");
const { performance } = require("perf_hooks");

// We simulate 1 minute of app usage for different epoch settings
const SIMULATION_TIME_MS = 60000;

function testEpochOverhead(epochDurationMs) {
  const epochName = epochDurationMs / 1000 + "s";
  console.log(`\n--- Testing Configuration: ${epochName} Epochs ---`);

  // How many times we need to derive a key in 1 minute
  const totalEpochs = SIMULATION_TIME_MS / epochDurationMs;

  const start = performance.now();

  // Simulate the work done in one minute
  for (let i = 0; i < totalEpochs; i++) {
    // 1. Vault Derivation (The math)
    // We do a heavier hash here (SHA-512) to be conservative/worst-case
    const hmac = crypto.createHmac("sha512", "vendor_secret_key_simulation");
    hmac.update("user_identity_payload_data_" + i);
    hmac.digest("hex");

    // 2. Strategy Switching Logic (The "If/Else" checks)
    // Simulate checking the epoch index to pick a strategy
    const strategy = i % 3;
    if (strategy === 0) {
      // Mock Strategy A Logic
    } else if (strategy === 1) {
      // Mock Strategy B Logic
    } else {
      // Mock Strategy C Logic
    }
  }

  const end = performance.now();

  // Total time spent DOING crypto work (not waiting)
  const activeTimeMs = end - start;

  // "Load" is the % of time the CPU was busy vs idle
  // (Active Work / Total Time Available) * 100
  const cpuLoad = (activeTimeMs / SIMULATION_TIME_MS) * 100;

  console.log(`Total Active Work: ${activeTimeMs.toFixed(4)} ms`);
  console.log(`Estimated CPU Overhead: ${cpuLoad.toFixed(6)}%`);

  // Calculate the theoretical attack window probability (for the red line)
  // Probability = Epoch Duration / 1 Hour (3600s)
  const attackProb = (epochDurationMs / 1000 / 3600) * 100;
  console.log(`Theoretical Attack Window: ${attackProb.toFixed(4)}%`);
}

console.log("Starting Graph B Data Collection (Simulation over 60s)...");

// Run for different Epoch sizes
testEpochOverhead(1000); // 1 Second (Extreme Security)
testEpochOverhead(5000); // 5 Seconds
testEpochOverhead(10000); // 10 Seconds (Your Proposed Poly-DIBSL)
testEpochOverhead(30000); // 30 Seconds
testEpochOverhead(60000); // 60 Seconds (Low Security)
