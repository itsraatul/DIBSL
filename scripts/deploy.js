const hre = require("hardhat");

async function main() {
  // Get the Contract Factory
  const LicenseSBT = await hre.ethers.getContractFactory("LicenseSBT");

  // Deploy the contract
  console.log("Deploying LicenseSBT...");
  const licenseSBT = await LicenseSBT.deploy();

  // Wait for deployment to finish
  await licenseSBT.waitForDeployment();

  // Get the address
  const address = await licenseSBT.getAddress();

  console.log("----------------------------------------------------");
  console.log("LicenseSBT deployed to:", address);
  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
