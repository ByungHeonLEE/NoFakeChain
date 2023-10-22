import { ethers } from "hardhat";
async function mint() {
  const Erc721 = await ethers.getContractFactory("NFT");
  const erc721 = await Erc721.attach("0x6b08108e2cc129258886fae62e9e4f6e84832ff2");
  const mint = await erc721.tokenURI(3);
  console.log('mint :', mint);
}
//0x6b08108e2Cc129258886faE62e9E4f6e84832Ff2
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
mint().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});