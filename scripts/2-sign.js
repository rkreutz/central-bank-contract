require('dotenv').config();

const main = async () => {

    const [signer] = await hre.ethers.getSigners();
    const address = await signer.getAddress();
    if (address !== process.env.SIGNING_ADDRESS) { throw "Not signing address" }
    const domain = {
        name: process.env.APP_NAME,
        version: process.env.APP_VERSION,
        chainId: 4,
        verifyingContract: process.env.CONTRACT_ADDRESS
    };

    const types = {
        Claim: [
            { name: 'claimer', type: 'address' },
            { name: 'token', type: 'address' },
            { name: 'amount', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
        ]
    };

    const value = {
        claimer: process.env.ADDRESS,
        token: "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b", // USDC
        amount: '100000000',
        nonce: 2
    };

    const signedMessage = await signer._signTypedData(domain, types, value);
    console.log('Successfully signed message:')
    console.log(signedMessage)
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