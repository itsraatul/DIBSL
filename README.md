Here is the updated **DIBSL README** formatted with the sections you requested, highlighting the technical implementation and the non-transferable nature of the licensing system.

---

# 🔐 DIBSL: Decentralized Identity-Bound Software Licensing
[cite_start]**Blockchain-Based Licensing with Polymorphic Cryptographic Vaults** [cite: 1]
> [cite_start]“By the Time You Break It — It’s Already Changed.” [cite: 125, 135]

## 📌 Overview
[cite_start]**DIBSL** is a blockchain-powered licensing platform that transforms traditional software keys into non-transferable **Soulbound Tokens (SBTs)** on the **Ethereum Sepolia Testnet**[cite: 1, 113]. [cite_start]Unlike standard DRM, it secures runtime execution through a **Polymorphic Cryptographic Vault** that rotates encryption strategies every 10 seconds, effectively eliminating the risk of RAM-dumping and binary patching[cite: 115, 122, 135].

## 🚀 Tech Stack Used
* [cite_start]**Backend:** Node.js + Express.js [cite: 297, 299]
* [cite_start]**Frontend:** React.js [cite: 297, 299]
* [cite_start]**Blockchain:** Ethereum (Sepolia Testnet) [cite: 113]
* [cite_start]**Smart Contracts:** Solidity [cite: 299]
* [cite_start]**Cryptography:** AES-256-GCM, SHA-256, SHA-512, and HMAC-SHA256 [cite: 301]
* [cite_start]**Infrastructure:** IPFS (via Pinata), Infura, and Metamask [cite: 303]

## ⚙️ Setup Instructions
1.  **Clone this repository**
    ```bash
    git clone https://github.com/itsraatul/dibsl.git
    cd dibsl
    ```
2.  **Install dependencies**
    ```bash
    # For Backend
    cd backend && npm install
    # For Frontend
    cd ../frontend && npm install
    ```
3.  **Configure Environment Variables**
    Create a `.env` file inside the `backend/` folder:
    * `SEPOLIA_RPC_URL`: Your Infura/Alchemy URL.
    * `PRIVATE_KEY`: Your wallet private key for signing assertions.
    * `CONTRACT_ADDRESS`: The address of the deployed SBT contract.
    * `MASTER_SECRET`: Your 32-byte hex key for polymorphic derivation.

4.  **Start the Services**
    * **Backend:** `node index.js` (Runs on `http://localhost:3000`)
    * **Frontend:** `npm start` (Runs on `http://localhost:5173`)

## 📜 Smart Contract Details
* [cite_start]**Contract Type:** Non-Transferable Soulbound Token (SBT) [cite: 214, 238]
* [cite_start]**Network:** Ethereum Sepolia Testnet [cite: 113]
* **Contract Address:** `0xC250F090ddE2d7B9041c257d973C1b4112469485`
* [cite_start]**Core Feature:** Identity-bound licenses with on-chain revocation (Kill Switch)[cite: 202, 310, 325].

## 💡 How to Use the Project

### For Software Vendors
1.  [cite_start]**Register License:** Issue a license as a **Soulbound Token** to the customer's wallet address[cite: 120, 292].
2.  [cite_start]**Set Tier:** Define license metadata (e.g., Enterprise, Pro) stored as on-chain attributes[cite: 128].
3.  [cite_start]**Manage State:** Revoke or expire licenses instantly via the blockchain dashboard[cite: 205, 312].

### For Customers
1.  [cite_start]**Identity Verification:** Connect your **Metamask wallet** to verify ownership of the non-transferable SBT[cite: 124, 162].
2.  [cite_start]**Launch Software:** The software client initiates a **Heartbeat Loop**, requesting a new execution assertion every 10 seconds[cite: 124, 171].
3.  [cite_start]**Secure Execution:** The **Ephemeral Cryptographic Vault (ECV)** derives a unique key for the current 10-second epoch, decrypts the software chunk, and immediately wipes the key from RAM to ensure **Forward Secrecy**[cite: 121, 136, 187].

## [cite_start]🔄 The Workflow [cite: 120, 307]
1.  [cite_start]**Vendor Issues License:** Stored on the blockchain as an identity-bound SBT[cite: 120].
2.  [cite_start]**Customer Requests Access:** Software client sends the wallet address and Token ID to the Control Plane[cite: 124].
3.  [cite_start]**Identity Check:** The Control Plane queries the **Sepolia Blockchain** to confirm the SBT is held by the requesting wallet[cite: 124].
4.  [cite_start]**Polymorphic Assertion:** If valid, the server calculates the current **Micro-Epoch** and selects a **Polymorphic Strategy** ($\tau \pmod 3$)[cite: 124, 135].
5.  [cite_start]**Execution Key Derivation:** The client vault uses the signed assertion to derive the unique $k_{exec}$ for that 10-second window[cite: 123, 138].
6.  [cite_start]**Secure Wipe:** After decryption, the key is destroyed from memory to prevent RAM forensics[cite: 125, 191].

## 👨‍💻 Team Members
* [cite_start]**Arunangshu Mojumder Raatul** — Developer & Researcher [cite: 4, 274]
* **Dr. [cite_start]Hemamalini V.** — Research Guide [cite: 2]

---

Would you like me to generate a **technical flowchart** or **sequence diagram** specifically for your `README.md` to visualize this 10-second heartbeat process?
