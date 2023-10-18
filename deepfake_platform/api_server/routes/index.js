var express = require('express');
const { chainLinkCall } = require('../controllers/chainlink/request');
const { mintNFT } = require('../controllers/nft/mint');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/executeFakeChain', async function(req, res, next) {
  const cl_res = await chainLinkCall();
  console.log("cl_res >>>", cl_res);
  const mint_Tx = await mintNFT("0xa40aa030A3ba4f42FDCd2B7bC33d5B03770290ea","0xa40aa030A3ba4f42FDCd2B7bC33d5B03770290ea");
  console.log("mint_Tx >>>", mint_Tx);
  res.send(cl_res);
});

module.exports = router;
