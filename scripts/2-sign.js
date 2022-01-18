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
            { name: 'tokenIdx', type: 'uint' },
            { name: 'amount', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
        ]
    };

    const value = {
        claimer: process.env.ADDRESS,
        tokenIdx: 0,
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