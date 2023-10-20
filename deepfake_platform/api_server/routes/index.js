var express = require('express');
var multer = require('multer')
const { chainLinkCall, decodeResponse } = require('../controllers/chainlink/request');
const { mintNFT } = require('../controllers/nft/mint');
var router = express.Router();
var upload = multer()

const web3_storage = require("../controllers/web3_storage/index");
const mongodb = require("../controllers/mongodb/index");

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
  res.send(`
  chainlik functions transaction is ${cl_tx.hash} 
  functions response is ${decodeCLresponse} and 
  mint tx is ${mint_Tx.hash}
  `);
});

router.post('/api/upload', upload.single('image'),async function(req,res){
  const cid = await web3_storage.storeFiles(req.file)
  const is_deepfake = true;
  const info = {
    cid: cid,
    "is_deepfake": is_deepfake
  }
  console.log("insert info: ",info)
  const result = await mongodb.insert(info)
  console.log("insert success: ",result)
  res.send(cid)
})

module.exports = router;
