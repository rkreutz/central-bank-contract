require('dotenv').config();

const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory('CentralBank');
    const nftContract = await nftContractFactory.deploy(
        process.env.SIGNING_ADDRESS, // Signer
        process.env.APP_NAME,
        process.env.APP_VERSION
    );
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);
};
  
const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
  
runMain();