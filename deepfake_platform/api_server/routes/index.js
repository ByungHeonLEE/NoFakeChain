var express = require("express");
var multer = require("multer");
const {
  chainLinkCall,
  decodeResponse,
} = require("../controllers/chainlink/request");
const { mintNFT } = require("../controllers/nft/mint");
var router = express.Router();
var upload = multer();
require("dotenv").config();

const web3_storage = require("../controllers/web3_storage/index");
const mongodb = require("../controllers/mongodb/index");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/execute", async function (req, res, next) {
  const clresponses = await chainLinkCall();
  const cl_tx = clresponses.transaction;
  console.log("cl_tx >>", cl_tx.hash);
  const requestId = clresponses.requestId;
  console.log("requestId >>", requestId);
  // const decodeCLresponse = await decodeResponse(requestId);
  // console.log("decodeCLresponse >>", decodeCLresponse);
  const tokenURI = await web3_storage.storeMetadata(process.env.IMG_IPFS, true);
  const nftAddress = "0x6b08108e2Cc129258886faE62e9E4f6e84832Ff2";
  const mint_Tx = await mintNFT(
    nftAddress,
    "0xA7FbD0905F8476AbE8E8111c95245781D0cbA5B0",
    `https://ipfs.io/ipfs/${tokenURI}/metadata.json`
  );
  console.log(mint_Tx);
  res.send(
    `
  chainlik functions transaction is ${cl_tx.hash}
  functions response is ${decodeCLresponse} and
  token URI on filecoin is ${tokenURI} and
  mint tx is ${mint_Tx.hash}
  opensea nft is https://testnets.opensea.io/assets/mumbai/${nftAddress}
  `
  );
});

router.post("/api/upload", upload.single("image"), async function (req, res) {
  const cid = await web3_storage.storeFiles(req.file);
  const is_deepfake = true;
  const info = {
    cid: cid,
    is_deepfake: is_deepfake,
  };
  console.log("insert info: ", info);
  const result = await mongodb.insert(info);
  console.log("insert success: ", result);

  res.send(cid);
});

module.exports = router;
