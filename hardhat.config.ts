import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

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
      accounts:
        process.env.KEY1 !== undefined ? [process.env.KEY1] : [],
    },
  },
};

export default config;
