const fs = require("fs");
const path = require("path");
const {
  SubscriptionManager,
  simulateScript,
  ResponseListener,
  ReturnType,
  decodeResult,
  FulfillmentCode,
} = require("@chainlink/functions-toolkit");
const functionsConsumerAbi = require("./abi.json");
const ethers = require("ethers");
require('dotenv').config();

const consumerAddress = "0xF914F3FAf67b360C6C1e613fef9653f3a2884BA6"; // REPLACE this with your Functions consumer address
const subscriptionId = 417; // REPLACE this with your subscription ID
const routerAddress = "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C";
const linkTokenAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
const donId = "fun-polygon-mumbai-1";
const explorerUrl = "https://mumbai.polygonscan.com";

const chainLinkCall = async () => {
  // hardcoded for Polygon Mumbai


  // Initialize functions settings
  const source = fs
    .readFileSync(path.resolve(__dirname, "source.js"))
    .toString();
  //TODO 여기에 인자 값을 넣어서 넘긴다. 
  const args = ["ETH", "USD"];
  const gasLimit = 300000;

  // Initialize ethers signer and provider to interact with the contracts onchain
  const privateKey = process.env.PRIVATE_KEY; // fetch PRIVATE_KEY
  if (!privateKey)
    throw new Error(
      "private key not provided - check your environment variables"
    );

  const rpcUrl = process.env.RPC_URL_MATIC; // fetch mumbai RPC URL

  if (!rpcUrl)
    throw new Error(`rpcUrl not provided  - check your environment variables`);
  
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider); // create ethers signer for signing transactions

  ///////// START SIMULATION ////////////

  // console.log("Start simulation...");

  // const response = await simulateScript({
  //   source: source,
  //   args: args,
  //   bytesArgs: [], // bytesArgs - arguments can be encoded off-chain to bytes.
  //   secrets: {}, // no secrets in this example
  // });

  // console.log("Simulation result", response);
  // const errorString = response.errorString;
  // if (errorString) {
  //   console.log(`❌ Error during simulation: `, errorString);
  // } else {
  //   const returnType = ReturnType.uint256;
  //   const responseBytesHexstring = response.responseBytesHexstring;
  //   if (ethers.utils.arrayify(responseBytesHexstring).length > 0) {
  //     const decodedResponse = decodeResult(
  //       response.responseBytesHexstring,
  //       returnType
  //     );
  //     console.log(`✅ Decoded response to ${returnType}: `, decodedResponse);
  //   }
  // }

  //////// ESTIMATE REQUEST COSTS ////////
  console.log("\nEstimate request costs...");
  // Initialize and return SubscriptionManager
  const subscriptionManager = new SubscriptionManager({
    signer: signer,
    linkTokenAddress: linkTokenAddress,
    functionsRouterAddress: routerAddress,
  });
  await subscriptionManager.initialize();

  // estimate costs in Juels

  const gasPriceWei = await signer.getGasPrice(); // get gasPrice in wei

  const estimatedCostInJuels =
  await subscriptionManager.estimateFunctionsRequestCost({
    donId: donId, // ID of the DON to which the Functions request will be sent
    subscriptionId: subscriptionId, // Subscription ID
    callbackGasLimit: gasLimit, // Total gas used by the consumer contract's callback
    gasPriceWei: BigInt(gasPriceWei), // Gas price in gWei
  });

  console.log(
    `Fulfillment cost estimated to ${ethers.utils.formatEther(
      estimatedCostInJuels
    )} LINK`
  );

  //////// MAKE REQUEST ////////

  // console.log("\nMake request...");

  const functionsConsumer = new ethers.Contract(
    consumerAddress,
    functionsConsumerAbi,
    signer
  );

  // To simulate the call and get the requestId.
  const requestId = await functionsConsumer.callStatic.sendRequest(
    source, // source
    "0x", // user hosted secrets - encryptedSecretsUrls - empty in this example
    0, // don hosted secrets - slot ID - empty in this example
    0, // don hosted secrets - version - empty in this example
    args,
    [], // bytesArgs - arguments can be encoded off-chain to bytes.
    subscriptionId,
    gasLimit,
    ethers.utils.formatBytes32String(donId) // jobId is bytes32 representation of donId
  );

  // Actual transaction call
  const transaction = await functionsConsumer.sendRequest(
    source, // source
    "0x", // user hosted secrets - encryptedSecretsUrls - empty in this example
    0, // don hosted secrets - slot ID - empty in this example
    0, // don hosted secrets - version - empty in this example
    args,
    [], // bytesArgs - arguments can be encoded off-chain to bytes.
    subscriptionId,
    gasLimit,
    ethers.utils.formatBytes32String(donId) // jobId is bytes32 representation of donId
  )

  const result = {
    "requestId" : requestId,
    "transaction" : transaction
  }

  return result;
};

async function decodeResponse(requestId) {
  const rpcUrl = process.env.RPC_URL_MATIC; // fetch mumbai RPC URL

  if (!rpcUrl)
    throw new Error(`rpcUrl not provided  - check your environment variables`);
  
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const responseListener = new ResponseListener({
    provider: provider,
    functionsRouterAddress: routerAddress,
  }); // Instantiate a ResponseListener object to wait for fulfillment.

  const response = await new Promise((resolve, reject) => {
    responseListener
      .listenForResponse(requestId)
      .then((response) => {
        resolve(response); // Resolves once the request has been fulfilled.
      })
      .catch((error) => {
        reject(error); // Indicate that an error occurred while waiting for fulfillment.
      });
  })
  // const fulfillmentCode = response.fulfillmentCode;

  // if (fulfillmentCode === FulfillmentCode.FULFILLED) {
  //   console.log(
  //     `\n✅ Request ${requestId} successfully fulfilled. Cost is ${ethers.utils.formatEther(
  //       response.totalCostInJuels
  //     )} LINK.Complete reponse: `,
  //     response
  //   );
  // } else if (fulfillmentCode === FulfillmentCode.USER_CALLBACK_ERROR) {
  //   console.log(
  //     `\n⚠️ Request ${requestId} fulfilled. However, the consumer contract callback failed. Cost is ${ethers.utils.formatEther(
  //       response.totalCostInJuels
  //     )} LINK.Complete reponse: `,
  //     response
  //   );
  // } else {
  //   console.log(
  //     `\n❌ Request ${requestId} not fulfilled. Code: ${fulfillmentCode}. Cost is ${ethers.utils.formatEther(
  //       response.totalCostInJuels
  //     )} LINK.Complete reponse: `,
  //     response
  //   );
  // }

  const errorString = response.errorString;
  if (errorString) {
    console.log(`\n❌ Error during the execution: `, errorString);
  } else {
    const responseBytesHexstring = response.responseBytesHexstring;
    if (ethers.utils.arrayify(responseBytesHexstring).length > 0) {
      const decodedResponse = decodeResult(
        response.responseBytesHexstring,
        ReturnType.uint256
      );
      console.log(
        `\n✅ Decoded response to ${ReturnType.uint256}: `,
        decodedResponse
      );
      return decodedResponse
    }
  }
}


module.exports = {
  chainLinkCall,
  decodeResponse
}