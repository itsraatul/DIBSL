// measure_graph_c.js
const crypto = require("crypto");
const { performance } = require("perf_hooks");

const ITERATIONS = 1000; // Run each strategy 1000 times to get a stable average

function benchmarkStrategy(name, fn) {
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    fn(i);
  }
  const end = performance.now();
  const avgTime = (end - start) / ITERATIONS;

  // We convert to Microseconds (µs) because these are very fast
  console.log(`${name}: ${(avgTime * 1000).toFixed(2)} µs per op`);
  return avgTime * 1000;
}

console.log(`\n--- Benchmarking Polymorphic Strategies (n=${ITERATIONS}) ---`);

// 1. STRATEGY 0: HMAC-SHA256 (Fastest)
// Standard symmetric signing.
const time0 = benchmarkStrategy("Strategy 0 (HMAC-SHA256)", (i) => {
  const hmac = crypto.createHmac("sha256", "secret_key");
  hmac.update("payload_data_" + i);
  hmac.digest("hex");
});

// 2. STRATEGY 1: SHA512-Concat (Medium)
// Concatenating data + salt manually, then hashing. Larger block size.
const time1 = benchmarkStrategy("Strategy 1 (SHA512-Concat)", (i) => {
  const hash = crypto.createHash("sha512");
  hash.update("payload_data_" + i + "_salt_string");
  hash.digest("hex");
});

// 3. STRATEGY 2: PBKDF2 (Heavy / Memory Hard)
// Represents a "Paranoid Mode" strategy (like Argon2) used for high-value transactions.
// We use 1000 iterations here to simulate a heavier cost.
const time2 = benchmarkStrategy("Strategy 2 (PBKDF2-Heavy)", (i) => {
  // Sync version is used to block event loop (simulating intensive calculation)
  crypto.pbkdf2Sync("password_" + i, "salt", 1000, 64, "sha512");
});

console.log("\n--- RAW DATA FOR GRAPH C ---");
console.log(`Strategies = ['HMAC-SHA256', 'SHA512-Concat', 'PBKDF2-Heavy']`);
console.log(
  `Times_Microseconds = [${time0.toFixed(2)}, ${time1.toFixed(
    2
  )}, ${time2.toFixed(2)}]`
);
