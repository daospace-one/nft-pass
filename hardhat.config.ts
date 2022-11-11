import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import '@openzeppelin/hardhat-upgrades';

dotenv.config();


const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    localhost: { },
    fuji: {
      url: `https://api.avax-test.network/ext/bc/C/rpc`,
      accounts:
        process.env.KEY1 !== undefined ? [process.env.KEY1] : [],
    },
    glmr: {
      url: `https://rpc.api.moonbeam.network`,
      timeout: 3800000,
      accounts:
        process.env.KEY1 !== undefined ? [process.env.KEY1, process.env.KEY2] : [],
    },
    avax: {
      url: `https://api.avax.network/ext/bc/C/rpc`,
      accounts:
        process.env.KEY1 !== undefined ? [process.env.KEY1] : [],
    },
  },
  mocha: {
      timeout: 3600000,
  }
};

export default config;
