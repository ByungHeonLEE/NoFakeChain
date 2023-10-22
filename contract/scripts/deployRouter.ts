import { ethers } from "hardhat";

async function main() {

  const consumerAddress = "0x13E3d53F499dd2d5200267699a437FC683dd8993";
  const nft = "0xC642107E4b3BcF3c7Cd213C1624310E19271B3da";
  const router = await ethers.deployContract("DeepFakeRouter",[nft, consumerAddress]);

  await router.waitForDeployment();
  const routerAddress = await router.getAddress();
  console.log("routerAddress >>", routerAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
