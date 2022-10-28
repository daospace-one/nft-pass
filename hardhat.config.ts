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
      url: `https://rpc.ankr.com/moonbeam`,
      accounts:
        process.env.KEY1 !== undefined ? [process.env.KEY1] : [],
    },
    avax: {
      url: `https://api.avax.network/ext/bc/C/rpc`,
      accounts:
        process.env.KEY1 !== undefined ? [process.env.KEY1] : [],
    },
  },
};

export default config;
