const express = require("express");
const mongoose = require("mongoose");
const Coin = require("./models/Coin");
const User = require("./models/User");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

console.log("process.env.JWT_SECRET", process.env.JWT_SECRET);

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected!"))
  .catch((err) => console.log(err));

app.post("/coin/new", async (req, res) => {
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

app.post("/coin/new", async (req, res) => {
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

app.get("/coins", async (req, res) => {
  const coins = await Coin.find();
  res.json(coins);
});

app.delete("/coin/delete/:id", async (req, res) => {
  const result = await Coin.findByIdAndDelete(req.params.id);

  res.json(result);
});

// const coinRoutes = require("./routes/coinRoutes");
// const userRoutes = require("./routes/userRoutes");

// app.use("/coins", coinRoutes);
// app.use("/users", userRoutes);

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  try {
    await user.save();

    const token = createToken(user._id);

    res.status(201).json({ token, email });
    console.log("user successfully signed up");
  } catch (error) {
    console.error(`Failed to sign up user: ${error}`);
    res.status(500).json({ message: "Failed to sign up user" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    res.json({ token, email });
    console.log("user successfully logged in");
  } catch (error) {
    console.error(`Failed to log in user: ${error}`);
    res.status(500).json({ message: "Failed to log in user" });
  }
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
