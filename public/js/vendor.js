const contractAddress = document
  .getElementById("contractAddr")
  .innerText.trim();

// Minimal ABI to interact with issueLicense
const abi = [
  "function issueLicense(address to, uint256 productId, uint64 expiry, uint8 tier) external returns (uint256)",
];

let provider, signer;

// 🔥 UPGRADED LOGGER: Adds color coding for the new Tailwind terminal
function log(msg, type = "info") {
  const box = document.getElementById("logs");
  let colorClass = "text-slate-400"; // default

  if (type === "success") colorClass = "text-green-400";
  if (type === "error") colorClass = "text-red-400";
  if (type === "highlight") colorClass = "text-brand-400";

  box.innerHTML += `<div class="${colorClass}">> ${msg}</div>`;
  box.scrollTop = box.scrollHeight;
}

document.getElementById("connectBtn").addEventListener("click", async () => {
  if (!window.ethereum) return alert("Please install MetaMask");

  try {
    // 🔥 FORCE METAMASK POPUP
    await window.ethereum.request({ method: "eth_requestAccounts" });

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const address = await signer.getAddress();

    document.getElementById("adminAddr").innerText = address;

    // 🔥 TAILWIND CSS BUTTON UPDATE
    const btn = document.getElementById("connectBtn");
    btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Connected`;
    btn.classList.remove("bg-slate-900", "hover:bg-slate-800");
    btn.classList.add("bg-green-600", "hover:bg-green-500");

    log(`Connected Admin Node: ${address}`, "success");
  } catch (err) {
    console.error(err);
    log(`Wallet Connection Error: ${err.message}`, "error");
  }
});

document.getElementById("mintForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!signer) return alert("Connect wallet first!");

  const to = document.getElementById("recipient").value;

  // 🔥 Convert to proper number types
  const pId = Number(document.getElementById("productId").value);
  const tier = Number(document.getElementById("tier").value);
  const days = Number(document.getElementById("days").value);

  // Calculate Expiry (Current Time + Days)
  const expiryDate = Math.floor(Date.now() / 1000) + days * 86400;

  log(
    `Preparing to mint Polymorphic License SBT for ${to.substring(0, 8)}...`,
    "info",
  );

  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Send Transaction
    const tx = await contract.issueLicense(to, pId, expiryDate, tier);
    log(
      `Transaction broadcasted! Hash: ${tx.hash.substring(0, 15)}...`,
      "highlight",
    );
    log(`Awaiting network confirmation...`, "info");

    await tx.wait();
    log(`✅ License SBT Minted & Bound Successfully!`, "success");

    // Optional: Keeps the alert for an undeniable visual confirmation during your demo
    alert("License Minted Successfully!");
  } catch (err) {
    console.error(err);
    log(`❌ Minting Failed: ${err.message}`, "error");
  }
});
