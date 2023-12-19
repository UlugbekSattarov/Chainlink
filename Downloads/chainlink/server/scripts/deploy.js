async function deployContract() {
  const [account] = await ethers.getSigners();

  console.log("Contract deployment initiated by account:", account.address);

  const ContractFactory = await ethers.getContractFactory("PriceFeedManager");
  const deployedContract = await ContractFactory.deploy();

  console.log("Deployed PriceFeedManager contract at address:", deployedContract.address);
}

deployContract()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
