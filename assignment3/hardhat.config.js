/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.7",
  networks: {
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/9qv4B9bmJH1Rlnw4sqN9qeQ9PontNc5x",
      accounts: [`0xe824c00ac805028529c4bb35a4d4501c54f4446691834c4e1b3233c338187b52`],
      chainId: 11155111,
      blockConfirmations: 6,
    },
  }
};
