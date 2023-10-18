var express = require('express');
const { chainLinkCall, decodeResponse } = require('../controllers/chainlink/request');
const { mintNFT } = require('../controllers/nft/mint');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/execute', async function(req, res, next) {
  const clresponses = await chainLinkCall();
  const cl_tx = clresponses.transaction;
  console.log("cl_tx >>", cl_tx.hash);
  const requestId = clresponses.requestId;
  console.log("requestId >>", requestId);
  const decodeCLresponse = await decodeResponse(requestId);
  console.log("decodeCLresponse >>", decodeCLresponse);
  const mint_Tx = await mintNFT("0xa40aa030A3ba4f42FDCd2B7bC33d5B03770290ea","0xa40aa030A3ba4f42FDCd2B7bC33d5B03770290ea");
  console.log("mint_Tx >>", mint_Tx);
  res.send("complete")
  res.send(`
  chainlik functions transaction is ${cl_tx.hash} 
  functions response is ${decodeCLresponse} and 
  mint tx is ${mint_Tx.hash}
  `);
});

module.exports = router;
