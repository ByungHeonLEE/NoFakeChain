import { ethers } from "hardhat";

async function main() {

  const test = await ethers.deployContract("TEST");

  await test.waitForDeployment();


  await test.test();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
