require('dotenv').config();

const main = async () => {
    const MyContract = await ethers.getContractFactory("CentralBank");
    const contract = await MyContract.attach(process.env.CONTRACT_ADDRESS);

    await contract.claim(
        0, // Token index
        100000000, // amount
        2, // nonce
        "0xa37de85685e9905a0dce7afbd8797daf81dec050ad69afb7bf04771db8251e070d157882baab7d2047b331966cda5d4ac9fb81fb074d15edf6dce4b2fa483adf1b" // signature
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

