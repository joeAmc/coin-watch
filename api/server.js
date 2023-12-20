const express = require("express");
const mongoose = require("mongoose");
const Coin = require("./models/Coin");
const User = require("./models/User");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

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
  const coin = new Coin({
    ticker: req.body.ticker,
    amount: req.body.amount,
    name: req.body.name,
    user_id: req.body.user_id,
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

app.get("/coins/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const coins = await Coin.find({ user_id: userId });

    // Check if the user has any coins
    if (!coins || coins.length === 0) {
      return res.status(404).json({ message: "No coins found for this user" });
    }

    res.json(coins);
  } catch (error) {
    console.error(`Failed to fetch coins: ${error}`);
    res.status(500).json({ message: "Failed to fetch coins" });
  }
});

app.delete("/coin/delete/:id", async (req, res) => {
  const result = await Coin.findByIdAndDelete(req.params.id);

  res.json(result);
});

app.put("/coin/update/:coinId", async (req, res) => {
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

app.post("/coin/check-coin", async (req, res) => {
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

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const saltRounds = 10;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ email, hashedPassword });
    await user.save();

    const token = createToken(user._id);

    res.status(201).json({ _id: user._id, token, email });
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

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.json({ token, email, _id: user._id });
    console.log("User successfully logged in");
  } catch (error) {
    console.error(`Failed to log in user: ${error}`);
    res.status(500).json({ message: "Failed to log in user" });
  }
});

// app.post("/check-user", async (req, res) => {
//   const { email } = req.body;
//   console.log("email", email);

//   try {
//     const existingUser = await User.findOne({
//       $or: [{ email }],
//     });
//     console.log("existingUser", existingUser);

//     if (existingUser) {
//       return res.json({ exists: true });
//     }

//     res.json({ exists: false });
//   } catch (error) {
//     console.error(`Failed to check user: ${error}`);
//     res.status(500).json({ message: "Failed to check user" });
//   }
// });

// app.get("/users", async (req, res) => {
//   const users = await User.find();
//   res.json(users);
// });

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

// Coin-related routes
// app.use("/coin/update/:coinId", coinRoutes);
// app.use("/coin/delete/:id", coinRoutes);
// app.use("/coin/check-coin", coinRoutes);
// app.use("/coins/:userId", coinRoutes);
// app.use("/coin/new", coinRoutes);

// User-related routes
// app.use("/signup", userRoutes);
// app.use("/login", userRoutes);
// app.use("/check-user", userRoutes);
