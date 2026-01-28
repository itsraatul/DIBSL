const { performance } = require("perf_hooks");
require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, Client JS)
app.use(express.static(path.join(__dirname, "../public")));

// Set View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// ---------------------------------------------------------
// BLOCKCHAIN SETUP
// ---------------------------------------------------------
const RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Load Contract ABI
// We read the JSON file Hardhat created during compilation
const ARTIFACT_PATH = path.join(
  __dirname,
  "../artifacts/contracts/LicenseSBT.sol/LicenseSBT.json"
);
const contractArtifact = JSON.parse(fs.readFileSync(ARTIFACT_PATH, "utf8"));
const CONTRACT_ABI = contractArtifact.abi;

// Initialize Provider & Wallet (The Control Plane's Authority)
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

console.log("--------------------------------------------------");
console.log("DIBSL Control Plane Initializing...");
console.log("Connected to Sepolia");
console.log("Contract:", CONTRACT_ADDRESS);
console.log("Control Plane Authority:", wallet.address);
console.log("--------------------------------------------------");

// ---------------------------------------------------------
// ROUTES
// ---------------------------------------------------------

// 1. Home Page (Simulates a Software Vendor Dashboard)
app.get("/", (req, res) => {
  res.render("index", {
    contractAddress: CONTRACT_ADDRESS,
    vendorAddress: wallet.address,
  });
});

// 2. Client Runtime (Simulates the Protected Software)
app.get("/app", (req, res) => {
  res.render("app", {
    contractAddress: CONTRACT_ADDRESS,
  });
});

// ---------------------------------------------------------
// API: CONTROL PLANE AUTHORITY (Heartbeat/Stream Mode)
// ---------------------------------------------------------
app.post("/api/authorize", async (req, res) => {
  const start = performance.now();
  const { walletAddress } = req.body;

  console.log(`\n[Control Plane] Received Auth Request`);
  console.log(`User: ${walletAddress}`);

  try {
    // 1. QUERY BLOCKCHAIN
    const tokenId = req.body.tokenId || 1;
    const data = await contract.getLicense(tokenId);
    const owner = data[4];
    const isActive = data[5];
    const tier = data[3];

    // 2. CHECK VALIDITY
    if (owner.toLowerCase() !== walletAddress.toLowerCase())
      throw new Error("Owner mismatch");
    if (!isActive) throw new Error("License invalid/expired");

    // 3. GENERATE ASSERTION (PhD Novelty: Micro-Epochs)
    const EPOCH_WINDOW = 10; // 10 Seconds
    const epoch = Math.floor(Date.now() / 1000 / EPOCH_WINDOW);
    const status = "valid";

    // 4. POLYMORPHIC STRATEGY (Moving Target Defense)
    // We select a logic strategy based on the epoch (Deterministic Randomness)
    // Strategy 0: HMAC-SHA256
    // Strategy 1: SHA512-Concat
    // Strategy 2: Reverse-Salt SHA256
    const logic_strategy = epoch % 3;

    console.log(
      `[Polymorph] Epoch ${epoch} -> Enforcing Strategy #${logic_strategy}`
    );

    // Packing data including the NEW logic_strategy
    const payload = ethers.solidityPackedKeccak256(
      ["address", "string", "uint256", "string", "uint8"], // Added uint8 for strategy
      [walletAddress, tier.toString(), epoch, status, logic_strategy]
    );

    const signature = await wallet.signMessage(ethers.getBytes(payload));

    const end = performance.now(); // <--- 2. STOP TIMER
    console.log(
      `[Metric] Bridge Verification Time: ${(end - start).toFixed(4)} ms`
    ); // <--- 3. LOG IT

    res.json({
      authorized: true,
      assertion: {
        id: walletAddress,
        tier: tier.toString(),
        epoch: epoch,
        status: status,
        signature: signature,
        logic_strategy: logic_strategy,
      },
    });
  } catch (err) {
    console.error(`[Control Plane] DENIED: ${err.message}`);
    res.status(403).json({ authorized: false, error: err.message });
  const end = performance.now(); 
    console.log(`[Metric] Bridge Verification Time (Failed): ${(end - start).toFixed(4)} ms`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
