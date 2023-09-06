const express = require("express");
const Coin = require("../models/Coin");
const router = express.Router();

router.post("/coin/new", async (req, res) => {
  const userId = req.user._id;

  const coin = new Coin({
    name: req.body.name,
    ticker: req.body.ticker,
    user: userId,
    amount: req.body.amount,
  });

  try {
    await coin.save();
    res.status(201).json(coin);
    console.log("coin successfully sent");
  } catch (error) {
    console.error(`Failed to create coin: ${error}`);
    res.status(500).json({ message: "Failed to add coin" });
  }
});

router.get("/coins", async (req, res) => {
  const coins = await Coin.find();
  res.json(coins);
});
