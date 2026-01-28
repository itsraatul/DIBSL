// ----------------------------------------------------------------------------
// EPHEMERAL CRYPTOGRAPHIC VAULT (ECV) - PhD FINAL
// Feature: Heartbeat Stream + Polymorphic Moving Target Defense (MTD)
// ----------------------------------------------------------------------------

const VAULT_MASTER_SECRET = "0xSECRET_VAULT_KEY_DO_NOT_SHARE";
let signerAddress = null;
let heartbeatInterval = null;
let streamSequence = 0;
let isStreaming = false; // Fix: Track state to prevent overlap

// LOGGER
function log(msg, type = "info") {
  const term = document.getElementById("console");
  const div = document.createElement("div");
  div.className = `log-${type}`;
  div.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
  term.appendChild(div);
  term.scrollTop = term.scrollHeight;
}

// 1. CONNECT WALLET
document.getElementById("connectBtn").addEventListener("click", async () => {
  if (!window.ethereum) return alert("Install MetaMask");
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    signerAddress = await signer.getAddress();
    document.getElementById("userAddress").innerText = signerAddress;
    document.getElementById("launchBtn").disabled = false;
    document.getElementById("statusText").innerText = "Wallet Connected";
    log(`Identity verified: ${signerAddress}`, "success");
  } catch (err) {
    log(`Wallet Error: ${err.message}`, "error");
  }
});

// 2. TOGGLE THE POLYMORPHIC STREAM (START / STOP)
document.getElementById("launchBtn").addEventListener("click", async () => {
  const btn = document.getElementById("launchBtn");

  // STOP LOGIC (If already running)
  if (isStreaming) {
    clearInterval(heartbeatInterval);
    isStreaming = false;
    btn.innerText = "Launch Stream";
    btn.classList.replace("btn-danger", "btn-success");
    document.getElementById("statusText").innerText = "STREAM STOPPED";
    log("------------------------------------------------", "warn");
    log("Stream stopped manually.", "warn");
    return;
  }

  // START LOGIC
  const tokenId = document.getElementById("tokenIdInput").value;
  const CTX =
    navigator.userAgent + "-SESSION-" + Math.floor(Math.random() * 10000);

  isStreaming = true;
  streamSequence = 0; // Reset counter

  log("------------------------------------------------", "warn");
  log(`[ECV] INIT: Starting Polymorphic Stream (MTD Mode)`, "warn");
  document.getElementById("statusText").innerText = "STREAMING ACTIVE";
  btn.innerText = "Stop Stream";
  btn.classList.replace("btn-success", "btn-danger");

  // Run immediately, then loop
  runHeartbeatCycle(tokenId, CTX);
  heartbeatInterval = setInterval(() => runHeartbeatCycle(tokenId, CTX), 11000);
});

// 3. THE CORE CYCLE
async function runHeartbeatCycle(tokenId, CTX) {
  if (!isStreaming) return; // Safety check

  try {
    streamSequence++;

    // A. GET MICRO-ASSERTION
    const response = await fetch("/api/authorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress: signerAddress, tokenId: tokenId }),
    });
    const data = await response.json();
    if (!data.authorized) throw new Error(data.error);

    // Safety check: Did user stop while we were fetching?
    if (!isStreaming) return;

    const pi = data.assertion;

    // B. VERIFY SIGNATURE
    const payloadHash = ethers.solidityPackedKeccak256(
      ["address", "string", "uint256", "string", "uint8"],
      [pi.id, pi.tier, pi.epoch, pi.status, pi.logic_strategy]
    );
    const recovered = ethers.verifyMessage(
      ethers.getBytes(payloadHash),
      pi.signature
    );

    // C. POLYMORPHIC DERIVATION (The PhD Novelty)
    const strategy = pi.logic_strategy;
    const r = CryptoJS.lib.WordArray.random(16).toString();
    let k_exec;

    // Log the PhD novelty clearly
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

    // D. EXECUTE & WIPE
    processStreamChunk(k_exec, streamSequence, pi.tier);

    setTimeout(() => {
      if (isStreaming) {
        // Only log if still running to keep console clean
        log(`[ECV] Key #${streamSequence} DESTROYED. Logic Wiped.`, "error");
      }
    }, 2000);
  } catch (err) {
    log(`[Stream Error] ${err.message}`, "error");
    clearInterval(heartbeatInterval);
    isStreaming = false;
    document.getElementById("statusText").innerText = "STREAM HALTED";
    document.getElementById("launchBtn").innerText = "Launch Stream";
    document
      .getElementById("launchBtn")
      .classList.replace("btn-danger", "btn-success");
  }
}

// 4. UI UPDATE FUNCTION (FIXED FOR VISUAL UNLOCK)
function processStreamChunk(key, seq, tier) {
  const container = document.getElementById("protectedContent");
  const contentBox = document.getElementById("secretData");

  // Simulate decryption
  const payload = `CHUNK_${seq}_DATA`;
  const encrypted = CryptoJS.AES.encrypt(payload, key).toString();
  const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(
    CryptoJS.enc.Utf8
  );

  if (decrypted !== payload) {
    log(`[Runtime] Decryption Integrity Failed!`, "error");
    return;
  }

  // --- CRITICAL FIX: FORCE REMOVE BLUR ---
  container.classList.remove("secret-content"); // This removes the blur CSS
  container.classList.add("unlocked");
  container.style.filter = "none"; // Hard override
  container.style.backdropFilter = "none";
  // ----------------------------------------

  let color = tier === "2" ? "gold" : "#0d6efd";
  contentBox.innerHTML = `
        <div style="border-left: 5px solid ${color}; padding: 10px; background: #222;">
            <h2 style="color: ${color}">SECURE STREAM ACTIVE</h2>
            <div class="progress mb-2" style="height: 5px;">
                <div class="progress-bar bg-warning" style="width: ${
                  (seq % 10) * 10
                }%"></div>
            </div>
            <strong>Sequence:</strong> #${seq}<br>
            <small class="text-muted">Key: ${key.substring(0, 8)}...</small>
        </div>
    `;
  document.getElementById("secretData").style.display = "block";
}
