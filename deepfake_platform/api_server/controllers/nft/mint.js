const { ethers } = require('ethers');
const nftABI = require("./nftabi.json");
require('dotenv').config();

async function mintNFT(nftAddress,toAddress,tokenURI) {
    // Assuming you're connecting to a local Ethereum node. Replace with your own provider if needed.
    try {
        const privateKey = process.env.PRIVATE_KEY; // WARNING: Never expose your private key. Keep it secret.        
        const wallet = new ethers.Wallet(privateKey);
        const rpcUrl = process.env.RPC_URL_MATIC; // fetch mumbai RPC URL
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        const signer = wallet.connect(provider);
        const nftContract = new ethers.Contract(
            nftAddress,
            nftABI,
            signer
          );
        const tx = await nftContract.mint(toAddress,tokenURI);
        // Await for transaction to be mined
        await tx.wait();

        return tx;

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    mintNFT
};
