import { ethers } from "hardhat";

async function main() {
  const nft = await ethers.deployContract("NFT");

  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();

  const test = await ethers.deployContract("TEST", [nftAddress]);
  await test.waitForDeployment();
  const address = await test.getAddress();
  console.log("address >>", address)
  await nft.transferOwnership(address);
  const owner = await nft.owner()
  console.log("owner >>", owner);

  const name = await test.getName();
  console.log("name >>", name)
  await test.mintNFT();
  const nftowner = await nft.ownerOf(0);
  console.log("nftowner >>", nftowner);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
