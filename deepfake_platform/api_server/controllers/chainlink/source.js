// This example shows how to make a call to an open API (no authentication required)
// to retrieve asset price from a symbol(e.g., ETH) to another symbol (e.g., USD)

// CryptoCompare API https://min-api.cryptocompare.com/documentation?key=Price&cat=multipleSymbolsFullPriceEndpoint

// Refer to https://github.com/smartcontractkit/functions-hardhat-starter-kit#javascript-code

// Arguments can be provided when a request is initated on-chain and used in the request source code as shown below
const fromSymbol = args[0];
const toSymbol = args[1];

// make HTTP request
const url = "http://3.141.243.153:5000/api/classify/Qma85gCmHuFNbb8F18o4QctegyT6ZuPKrVaoyopiXAfhgo";
// console.log(`HTTP GET Request to ${url}?fsyms=${fromSymbol}&tsyms=${toSymbol}`);

// construct the HTTP Request object. See: https://github.com/smartcontractkit/functions-hardhat-starter-kit#javascript-code
// params used for URL query parameters
// Example of squery: https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD
const noFakeRequest = Functions.makeHttpRequest({
  url: url,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  // params: {
  //   fsyms: fromSymbol,
  //   tsyms: toSymbol,
  // },
});

// Execute the API request (Promise)
const noFakeResponse = await noFakeRequest;
if (noFakeResponse.error) {
  console.error(noFakeResponse.error);
  throw Error("Request failed");
}

// Solidity doesn't support decimals so multiply by 100 and round to the nearest integer
// Use Functions.encodeUint256 to encode an unsigned integer to a Buffer
return Functions.encodeString(
  `
  data : ${noFakeResponse["data"]["result"]}
  status : ${noFakeResponse["status"]}
  `
  );