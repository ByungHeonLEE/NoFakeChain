import { ethers } from "hardhat";

async function depolyContract() {
  // address of mumbai router
  const routerAddress = "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C";

  const ChainlinkContract = await ethers.deployContract(
    "FunctionsConsumerExample",
    [routerAddress]
  );

  await ChainlinkContract.waitForDeployment();

  console.log(
    ` deployed to ${ChainlinkContract.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
depolyContract().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
