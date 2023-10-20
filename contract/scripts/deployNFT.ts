import { ethers } from "hardhat";

async function depolyContract() {
  const NFTContract = await ethers.deployContract("NFT");

  await NFTContract.waitForDeployment();
  const nftAddress = await NFTContract.getAddress();
  console.log('nftAddress :', nftAddress);

  const mint = await NFTContract.mint("0xA7FbD0905F8476AbE8E8111c95245781D0cbA5B0","testing");

  await mint.wait();
  console.log(
    'NFTContract',await NFTContract.getAddress(),
    ` deployed to ${NFTContract.target}`
  );

  const erc721URI = await NFTContract.tokenURI(0);
  console.log('erc721URI :', erc721URI);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
depolyContract().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
