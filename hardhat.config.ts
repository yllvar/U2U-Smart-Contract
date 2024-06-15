import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    nebulas: {
      url: 'https://rpc-nebulas-testnet.uniultra.xyz/',
      accounts: ["76c3d77c5e5aa2f8b57c5ed1e98b319a129f49e54471ee6fc5cfe10932611cd8"], // it should start with 0x...
    }
  },
  etherscan: {
    apiKey: {
      nebulas: "abc", // arbitrary string
    },
    customChains: [
      {
        network: "nebulas",
        chainId: 2484,
        urls: {
          apiURL: "https://testnet.u2uscan.xyz/api",
          browserURL: "https://testnet.u2uscan.xyz"
        }
      },
    ]
  }
};

export default config;