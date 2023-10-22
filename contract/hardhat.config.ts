import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config'
import "@nomicfoundation/hardhat-verify";

const config: HardhatUserConfig = {
  networks: {
    hardhat: {},
    local: {
      url:'http://127.0.0.1:8545/',
      accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80']
    },
    matic: {
      url: process.env.POLYGON_MUMBAI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY!]
    }
  },
  solidity: "0.8.20",
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.MUMBAI_SCAN!
  }
};

export default config;
