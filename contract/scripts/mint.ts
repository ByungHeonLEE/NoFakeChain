import { ethers } from "hardhat";
async function mint() {
  const Erc721 = await ethers.getContractFactory("NFT");
  const erc721 = await Erc721.attach("0xDceC4Bfb241F7e45E03A57B2cDcea9Af0E2EBA41");
  console.log('erc721 :', erc721);

  const mint = await erc721.mint("0x0E702a92b26dfc3bf03C27f612D2fE3A1EBCEe45");
  console.log('mint :', mint);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
mint().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});