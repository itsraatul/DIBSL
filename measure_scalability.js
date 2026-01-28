// measure_scalability.js
const axios = require("axios");
const { performance } = require("perf_hooks");

const SERVER_URL = "http://localhost:3000/api/authorize";
const TEST_WALLET = "0xC250F090ddE2d7B9041c257d973C1b4112469485";

async function runLoadTest(concurrentClients) {
  console.log(`\n--- Simulating ${concurrentClients} Concurrent Clients ---`);

  const requests = [];
  const start = performance.now();

  // Launch all requests at once (Parallel)
  for (let i = 0; i < concurrentClients; i++) {
    requests.push(
      axios
        .post(SERVER_URL, { walletAddress: TEST_WALLET, tokenId: 1 })
        .catch((e) => e) // Ignore errors, just measure time
    );
  }

  // Wait for ALL to finish
  await Promise.all(requests);
  const end = performance.now();

  const totalTime = (end - start) / 1000; // Seconds
  const throughput = concurrentClients / totalTime; // Req/Sec
  const avgLatency = (end - start) / concurrentClients; // Rough avg latency

  console.log(`Throughput: ${throughput.toFixed(2)} assertions/sec`);
  console.log(`Avg Latency: ${avgLatency.toFixed(2)} ms`);
}

async function start() {
  // We ramp up the load
  await runLoadTest(10);
  await runLoadTest(50);
  await runLoadTest(100);
  // Note: Node.js is single-threaded, so 500 might hit a bottleneck locally,
  // which is exactly what we want to show (Saturation Point).
  await runLoadTest(500);
}

start();
