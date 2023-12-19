const express = require("express");
const Coin = require("../models/Coin");

const router = express.Router();

router.post("/coin/new", async (req, res) => {
  const coin = new Coin({
    ticker: req.body.ticker,
    amount: req.body.amount,
    name: req.body.name,
    user_id: req.body.user_id,
  });

  try {
    await coin.save();
    res.status(201).json(coin);
  } catch (error) {
    console.error(`Failed to create coin: ${error}`);
    res.status(500).json({ message: "Failed to add coin" });
  }
});

router.get("/coins/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const coins = await Coin.find({ user_id: userId });

    if (!coins || coins.length === 0) {
      return res.status(404).json({ message: "No coins found for this user" });
    }

    res.json(coins);
  } catch (error) {
    console.error(`Failed to fetch coins: ${error}`);
    res.status(500).json({ message: "Failed to fetch coins" });
  }
});

router.delete("/coin/delete/:id", async (req, res) => {
  const result = await Coin.findByIdAndDelete(req.params.id);

  res.json(result);
});

router.put("/coin/update/:coinId", async (req, res) => {
  const coinId = req.params.coinId;
  const newAmount = req.body.amount;

  try {
    const coin = await Coin.findById(coinId);

    if (!coin) {
      return res.status(404).json({ message: "Coin not found" });
    }

    coin.amount = newAmount;

    await coin.save();

    res.json(coin);
  } catch (error) {
    console.error(`Failed to update coin amount: ${error}`);
    res.status(500).json({ message: "Failed to update coin amount" });
  }
});

router.post("/coin/check-coin", async (req, res) => {
  const { name } = req.body;

  try {
    const existingCrypto = await Coin.findOne({
      $or: [{ name }],
    });

    if (existingCrypto) {
      return res.json({ exists: true });
    }

    res.json({ exists: false });
  } catch (error) {
    console.error(`Failed to check crypto: ${error}`);
    res.status(500).json({ message: "Failed to check crypto" });
  }
});

module.exports = router;
