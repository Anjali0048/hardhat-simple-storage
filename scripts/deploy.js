const { ethers, run, network } = require("hardhat")
require("dotenv").config();

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  console.log("Deploying contract...")
  const simpleStorage = await SimpleStorageFactory.deploy()

  await simpleStorage.getDeployedCode()
  console.log(`deployed contract to : ${simpleStorage.target}`)

  // console.log(network.config)
  if(network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY){
    console.log("Waiting for block confirmation...")
    await simpleStorage.deploymentTransaction().wait(6);
    await verify(simpleStorage.target, [])
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current value: ${currentValue}`);

  // update the current value
  const transactionResponse = await simpleStorage.store(526);
  await transactionResponse.wait(1);

  const updatedValue = await simpleStorage.retrieve();
  console.log(`updated value is : ${updatedValue}`)
}

const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if(e.message.toLowerCase().includes("already verified")){
      console.log("Already Verified!")
    } else{
      console.log(e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
