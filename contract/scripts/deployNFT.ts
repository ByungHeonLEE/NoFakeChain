import { ethers } from "hardhat";

async function depolyContract() {
  const NFTContract = await ethers.deployContract("NFT");

  await NFTContract.waitForDeployment();

  console.log(
    'NFTContract',await NFTContract.getAddress(),
    ` deployed to ${NFTContract.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
depolyContract().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
