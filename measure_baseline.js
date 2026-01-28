// measure_baseline.js
const { performance } = require("perf_hooks");

function measureBaseline() {
  const start = performance.now();

  // Simulate App Startup (Loading standard modules, parsing JSON)
  // No Blockchain, No Crypto, No Network.
  const fs = require("fs");
  const path = require("path");
  const config = JSON.parse('{"app": "running"}');

  const end = performance.now();
  console.log(`Baseline Startup Time: ${(end - start).toFixed(4)} ms`);
}

measureBaseline();
