require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load environment variables

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28", // Matches your hardhat version default
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY], // Uses your MetaMask key
    },
  },
};
