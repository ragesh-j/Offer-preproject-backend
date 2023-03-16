const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const offer = require("../Schema/offerSchema");
const {user} = require("../Schema/userSchema");
const app=express()
const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(fileUpload());

router.get("/finduser", async (req, res) => {
  console.log(req.user)
  res.status(200).json({ data: req.user });
});

router.post("/add", async (req, res) => {
  const {
    offerid,
    offertitle,
    offerdesc,
    offerimageurl,
    offercontent,
    offerto,
    offerpricecoins,
    offerpricegems,
  } = req.body;
  await offer.create({
    offerid,
    offertitle,
    offerdesc,
    offerimageurl,
    offercontent,
    offerto,
    offerpricecoins,
    offerpricegems,
  });
  res.status(200).json({ status: "Added" });
});

router.get("/getoffers", async (req, res) => {
  const userdata = req.user;
  if (userdata.purchaser == false) {
    const offers = await offer.find().sort({ offerpricegems: 1 });
    res.status(200).json({ offers });
  } else {
    const offers = await offer.find().sort({ offerpricegems: -1 });
    res.status(200).json({ offers });
  }
});

router.patch("/buy", async (req, res)=>{
  const { item, payment } = req.body;
  const orderitem = await offer.findOne({ offerid: item });
  if (payment == "coin") {
    let coin = req.user.coins;
    if (orderitem.offerpricecoins > coin) return res.status(400).json({ message: "Not enough coins" });
    coin = coin - orderitem.offerpricecoins;
    await user.updateOne({ player: req.user.player }, { coins: coin });
  } else {
    let gem = req.user.gems;
    if (orderitem.offerpricegems > gem)
      return res.status(400).json({ message: "Not enough gems" });
    gem = gem - orderitem.offerpricegems;
    await user.updateOne({ player: req.user.player }, { gems: gem });
  }
  let pack = req.user.packs;
  pack += item;
  await user.updateOne({ player: req.user.player }, { packs: pack });
  if (req.user.purchaser == false) {
  await user.updateOne({ player: req.user.player }, { purchaser: true });
  }
  res.status(200).json({ message: "Purchase successful" });
})

module.exports = router;