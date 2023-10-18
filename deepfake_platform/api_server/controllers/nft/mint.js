const { ethers } = require('ethers');
require('dotenv').config();

// Assuming you're connecting to a local Ethereum node. Replace with your own provider if needed.
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL_MATIC);
const nftABI = require("./nftabi.json");

async function mintNFT(nftAddress,toAddress) {
    try {
        const privateKey = process.env.PRIVATE_KEY; // WARNING: Never expose your private key. Keep it secret.        
        const signer = new ethers.Wallet(privateKey, provider);
        const nftContract = new ethers.Contract(nftAddress, nftABI);
        const txSigner= nftContract.connect(signer);
        const tx = await txSigner.safeMint(toAddress);
        console.log("tx >>>", tx);
        // Await for transaction to be mined
        await tx.wait();

        console.log("tx >>", tx);

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    mintNFT
};
