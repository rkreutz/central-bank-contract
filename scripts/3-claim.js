require('dotenv').config();

const main = async () => {
    const MyContract = await ethers.getContractFactory("CentralBank");
    const contract = await MyContract.attach(process.env.CONTRACT_ADDRESS);

    await contract.claim(
        '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b', // Token (USDC)
        1000000, // amount
        8, // nonce
        "0x3a2094288c9a60bc97d5e6d0d8c6da781ea7138df06771012ad417a7377f6b716e378b0dc88edd9478c2ad9fd1ef93ff052b8230d98fc6aaef9f9339486e4d971b" // signature
    ); 
    console.log('Successfully claimed!')
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

