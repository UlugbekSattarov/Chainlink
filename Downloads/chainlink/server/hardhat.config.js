require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
  solidity: "0.8.22",
  networks: {
    hardhat: {
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/9qv4B9bmJH1Rlnw4sqN9qeQ9PontNc5x",
      accounts: [`0xe824c00ac805028529c4bb35a4d4501c54f4446691834c4e1b3233c338187b52`]
    }
  }
};
