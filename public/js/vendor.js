const contractAddress = document.getElementById("contractAddr").innerText;

// Minimal ABI to interact with issueLicense
const abi = [
  "function issueLicense(address to, uint256 productId, uint64 expiry, uint8 tier) external returns (uint256)",
];

let provider, signer;

function log(msg) {
  const box = document.getElementById("logs");
  box.innerHTML += `<div>> ${msg}</div>`;
  box.scrollTop = box.scrollHeight;
}

document.getElementById("connectBtn").addEventListener("click", async () => {
  if (!window.ethereum) return alert("Please install MetaMask");

  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const address = await signer.getAddress();

    document.getElementById("adminAddr").innerText = address;
    document.getElementById("connectBtn").innerText = "Connected";
    document
      .getElementById("connectBtn")
      .classList.replace("btn-warning", "btn-success");

    log(`Connected: ${address}`);
  } catch (err) {
    console.error(err);
    log(`Error: ${err.message}`);
  }
});

document.getElementById("mintForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!signer) return alert("Connect wallet first!");

  const to = document.getElementById("recipient").value;
  const pId = document.getElementById("productId").value;
  const tier = document.getElementById("tier").value;
  const days = document.getElementById("days").value;

  // Calculate Expiry (Current Time + Days)
  const expiryDate = Math.floor(Date.now() / 1000) + days * 86400;

  log(`Preparing to mint license for ${to}...`);

  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Send Transaction
    const tx = await contract.issueLicense(to, pId, expiryDate, tier);
    log(`Transaction sent! Hash: ${tx.hash}`);
    log(`Waiting for confirmation...`);

    await tx.wait();
    log(`✅ License SBT Minted Successfully!`);
    alert("License Minted!");
  } catch (err) {
    console.error(err);
    log(`❌ Minting Failed: ${err.message}`);
  }
});
