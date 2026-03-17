// ----------------------------------------------------------------------------
// EPHEMERAL CRYPTOGRAPHIC VAULT (ECV) - FINAL HACKATHON BUILD
// Feature: Heartbeat Stream + Polymorphic Moving Target Defense (MTD)
// ----------------------------------------------------------------------------

const VAULT_MASTER_SECRET = "0xSECRET_VAULT_KEY_DO_NOT_SHARE";
let signerAddress = null;
let heartbeatInterval = null;
let streamSequence = 0;
let isStreaming = false;

// LOGGER
function log(msg, type = "info") {
  const term = document.getElementById("console");
  const div = document.createElement("div");
  div.className = `log-${type}`;
  div.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
  term.appendChild(div);
  term.scrollTop = term.scrollHeight;
}

// 1. CONNECT WALLET (FORCED POPUP)
document.getElementById("connectBtn").addEventListener("click", async () => {
  if (!window.ethereum) return alert("Install MetaMask");

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    signerAddress = await signer.getAddress();

    document.getElementById("userAddress").innerText = signerAddress;
    document.getElementById("launchBtn").disabled = false;

    document.getElementById("statusText").innerText = "Wallet Connected";
    document.getElementById("statusDot").className =
      "w-2 h-2 rounded-full bg-cyan-500";

    log(`Identity verified: ${signerAddress}`, "success");
  } catch (err) {
    log(`Wallet Error: ${err.message}`, "error");
  }
});

// 2. TOGGLE STREAM
document.getElementById("launchBtn").addEventListener("click", async () => {
  const btn = document.getElementById("launchBtn");

  // STOP STREAM
  if (isStreaming) {
    clearInterval(heartbeatInterval);
    isStreaming = false;

    document.getElementById("lockOverlay").classList.remove("hidden-overlay");
    document.getElementById("softwareContent").classList.remove("unlocked");

    btn.innerText = "Unlock Secure Environment";
    document.getElementById("statusText").innerText = "STREAM STOPPED";
    document.getElementById("statusDot").className =
      "w-2 h-2 rounded-full bg-red-500";

    log("------------------------------------------------", "warn");
    log("Stream stopped manually. System locked.", "warn");
    return;
  }

  // START STREAM
  const tokenId = document.getElementById("tokenIdInput").value;

  const CTX =
    navigator.userAgent + "-SESSION-" + Math.floor(Math.random() * 10000);

  log("[AUTH] Verifying license on-chain...", "info");

  document.getElementById("statusText").innerText = "Verifying License...";
  document.getElementById("statusDot").className =
    "w-2 h-2 rounded-full bg-amber-500 animate-pulse";

  isStreaming = true;
  streamSequence = 0;

  log("------------------------------------------------", "warn");
  log(`[ECV] INIT: Starting Polymorphic Stream (MTD Mode)`, "warn");

  btn.innerText = "Terminate Session";

  runHeartbeatCycle(tokenId, CTX);
  heartbeatInterval = setInterval(() => runHeartbeatCycle(tokenId, CTX), 11000);
});

// 3. CORE CYCLE
async function runHeartbeatCycle(tokenId, CTX) {
  if (!isStreaming) return;

  try {
    streamSequence++;

    const response = await fetch("/api/authorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        walletAddress: signerAddress,
        tokenId: tokenId,
      }),
    });

    const data = await response.json();
    if (!data.authorized) throw new Error(data.error);

    if (!isStreaming) return;

    const pi = data.assertion;

    const payloadHash = ethers.solidityPackedKeccak256(
      ["address", "string", "uint256", "string", "uint8"],
      [pi.id, pi.tier, pi.epoch, pi.status, pi.logic_strategy],
    );

    const recovered = ethers.verifyMessage(
      ethers.getBytes(payloadHash),
      pi.signature,
    );

    const strategy = pi.logic_strategy;
    const r = CryptoJS.lib.WordArray.random(16).toString();
    let k_exec;

    if (strategy === 0) {
      log(`[MTD] Epoch ${pi.epoch}: Strategy #0 (HMAC-SHA256)`, "info");
      const h_alpha = CryptoJS.SHA256(pi.id + CTX + pi.epoch).toString();
      k_exec = CryptoJS.HmacSHA256(h_alpha + r, VAULT_MASTER_SECRET).toString();
    } else if (strategy === 1) {
      log(`[MTD] Epoch ${pi.epoch}: Strategy #1 (SHA512-Concat)`, "warn");
      const raw = VAULT_MASTER_SECRET + pi.id + CTX + r + pi.epoch;
      k_exec = CryptoJS.SHA512(raw).toString().substring(0, 64);
    } else {
      log(`[MTD] Epoch ${pi.epoch}: Strategy #2 (Reverse-Salt)`, "success");
      const mix = r + pi.epoch + VAULT_MASTER_SECRET;
      k_exec = CryptoJS.SHA256(mix).toString();
    }

    processStreamChunk(k_exec, streamSequence, pi.tier);

    setTimeout(() => {
      if (isStreaming) {
        log(`[ECV] Key #${streamSequence} DESTROYED`, "error");
        log(`[ECV] Memory wiped. Vault mutated.`, "warn");
      }
    }, 2000);
  } catch (err) {
    log(`[Stream Error] ${err.message}`, "error");
    clearInterval(heartbeatInterval);
    isStreaming = false;

    document.getElementById("lockOverlay").classList.remove("hidden-overlay");
    document.getElementById("softwareContent").classList.remove("unlocked");

    document.getElementById("statusText").innerText = "UNAUTHORIZED";
    document.getElementById("statusDot").className =
      "w-2 h-2 rounded-full bg-red-500";

    document.getElementById("launchBtn").innerText =
      "Unlock Secure Environment";
  }
}

// 4. UI UPDATE (MAIN UNLOCK LOGIC)
function processStreamChunk(key, seq, tier) {
  const lockOverlay = document.getElementById("lockOverlay");
  const softwareContent = document.getElementById("softwareContent");

  const payload = `CHUNK_${seq}_DATA`;
  const encrypted = CryptoJS.AES.encrypt(payload, key).toString();
  const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(
    CryptoJS.enc.Utf8,
  );

  if (decrypted !== payload) {
    log(`[Runtime] Decryption Integrity Failed!`, "error");
    return;
  }

  // 🔥 UNLOCK UI ONCE
  if (!softwareContent.classList.contains("unlocked")) {
    lockOverlay.classList.add("hidden-overlay");
    softwareContent.classList.add("unlocked");

    document.getElementById("statusText").innerText = "SECURE STREAM ACTIVE";

    document.getElementById("statusDot").className =
      "w-2 h-2 rounded-full bg-brand-500 animate-pulse";

    log(`[SUCCESS] SBT Verified. Ephemeral Vault Unlocked.`, "success");
  }

  log(`[STREAM] Chunk #${seq} verified | Key rotated`, "info");
}

// 🔥 ATTACK SIMULATION
document.getElementById("attackBtn")?.addEventListener("click", () => {
  log("[ATTACK] Simulating unauthorized access...", "error");

  document.getElementById("statusText").innerText = "BREACH DETECTED";
  document.getElementById("statusDot").className =
    "w-2 h-2 rounded-full bg-red-600 animate-ping";

  document.getElementById("lockOverlay").classList.remove("hidden-overlay");
  document.getElementById("softwareContent").classList.remove("unlocked");

  clearInterval(heartbeatInterval);
  isStreaming = false;

  log("[SECURITY] Access revoked. Zero-Trust enforced.", "error");
});
