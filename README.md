# 🔐 DIBSL: Decentralized Identity-Bound Software Licensing

### *Blockchain-Based Licensing with Polymorphic Cryptographic Vaults*

**“By the Time You Break It — It’s Already Changed.”**

---

## 📌 Overview

DIBSL (Decentralized Identity-Bound Software Licensing) is a next-generation software licensing framework that binds software licenses directly to user identity using **Soulbound Tokens (SBTs)** and secures execution using **Polymorphic Cryptographic Vaults**.

Unlike traditional DRM systems or NFT-based licensing, DIBSL introduces a **dynamic, identity-bound, and time-variant execution model** that eliminates piracy, key sharing, and reverse engineering.

## The Working Procedure
<img width="1158" height="656" alt="image" src="https://github.com/user-attachments/assets/bf20206b-b7e7-4aed-847c-19dac46db915" />


---

## Problem Statement

*  $46B+ annual losses due to software piracy
*  License keys can be cracked, shared, or generated
*  DRM relies on **persistent secrets (insecure)**
*  Keys stored in memory → vulnerable to RAM dump attacks
*  Blockchain solves identity, but not execution security

> **Core Issue:**
> Existing systems verify identity but fail to secure runtime execution.

---

##  Solution

DIBSL introduces a **decentralized hybrid architecture** combining:

*  Identity-bound licensing via **Soulbound Tokens**
* ⚡Dynamic execution via **Polymorphic Cryptography**
*  Ephemeral key generation with **Forward Secrecy**

> **Key Idea:**
> *No static keys. No persistent secrets. Only dynamic execution.*

---

## Core Architecture

<img width="1394" height="648" alt="image" src="https://github.com/user-attachments/assets/fdcacf44-cf0b-4372-ae41-c2686fe76aba" />

###  Identity Layer — Soulbound Tokens (SBTs)

* Non-transferable blockchain tokens
* Permanently bound to wallet identity
* Represent licenses, not assets
* Revocable and verifiable on-chain

---

### Execution Layer — Polymorphic Cryptographic Vault

* Encryption logic changes dynamically
* Multiple strategies rotate per time epoch
* Prevents reverse engineering and static attacks
<img width="1215" height="618" alt="image" src="https://github.com/user-attachments/assets/f4c6de74-3fde-4cd6-bc89-aaa968071afc" />

---

### Trust Layer — Blockchain Smart Contracts

* Verifies license ownership
* Enables revocation
* Provides tamper-proof validation

---

## ⚙️ Key Innovations

* **Polymorphic Cryptography** (dynamic algorithm rotation)
* **Micro-Epoch Execution Model (~10s intervals)**
* **Ephemeral Key Lifecycle (Generate → Use → Destroy)**
* **Forward Secrecy in execution**
* **Moving Target Defense (MTD)**


# ⚙️ Setup Instructions

## 1. Clone Repository
git clone https://github.com/itsraatul/DIBSL.git
cd DIBSL

## 2. Install Dependencies
npm install

## 3. Configure Environment Variables

Create a `.env` file:
PORT=3000

# Blockchain
RPC_URL=your_rpc_url
PRIVATE_KEY=your_wallet_private_key

# Smart Contract
CONTRACT_ADDRESS=your_contract_address

## 4. Run the Server


node server.js

Server runs on:
http://localhost:3000


# 🔗 Smart Contract Details

* Network: Ethereum / Polygon Testnet
* Standard: Soulbound Token (Non-transferable ERC variant)
* Functionality:

  * Mint license (SBT)
  * Verify ownership
  * Revoke license



# How to Use

## For Vendors (License Issuers)

* Issue license as a **Soulbound Token**
* Bind license to user wallet identity
* Deploy smart contract for verification

## For Users

* Connect wallet (MetaMask)
* Receive license (SBT)
* Launch software securely

## Verification (Runtime)

* System checks wallet ownership
* Vault generates ephemeral key
* Software executes securely
* Key destroyed after execution

# System Workflow

1. Developer issues SBT license
2. User connects wallet
3. Blockchain verifies identity
4. Vault generates execution key
5. Software runs
6. Every epoch:

   * Key changes
   * Logic mutates
   * Previous state destroyed


