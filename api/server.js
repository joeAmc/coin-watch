const express = require("express");
const mongoose = require("mongoose");
const Coin = require("./models/Coin");
const User = require("./models/User");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

console.log("process.env.MONGODB_URI", process.env.MONGODB_URI);
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

// const findUserIdByEmail = async (email) => {
//   try {
//     const user = await User.findOne({ email });
//     if (user) {
//       return user._id;
//     } else {
//       return null; // User not found
//     }
//   } catch (error) {
//     console.error(`Error finding user: ${error}`);
//     throw error;
//   }
// };

// app.post("/coin/new", async (req, res) => {
//   const { email } = req.body;

//   console.log("email", email);
//   try {
//     const userId = await findUserIdByEmail(email);

//     if (!userId) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const coin = new Coin({
//       ticker: req.body.ticker,
//       amount: req.body.amount,
//       name: req.body.name,
//       user_id: userId,
//     });

//     await coin.save();
//     res.status(201).json(coin);
//     console.log("Coin successfully saved");
//   } catch (error) {
//     console.error(`Failed to create coin: ${error}`);
//     res.status(500).json({ message: "Failed to add coin" });
//   }
// });

app.get("/coins/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Query the database to find all coins associated with the user
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
    // Find the coin by its ID
    const coin = await Coin.findById(coinId);

    // Check if the coin exists
    if (!coin) {
      return res.status(404).json({ message: "Coin not found" });
    }

    // Update the coin's amount
    coin.amount = newAmount;

    // Save the updated coin
    await coin.save();

    res.json(coin);
  } catch (error) {
    console.error(`Failed to update coin amount: ${error}`);
    res.status(500).json({ message: "Failed to update coin amount" });
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  try {
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
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    res.json({ token, email, _id: user._id });
    console.log("user successfully logged in");
  } catch (error) {
    console.error(`Failed to log in user: ${error}`);
    res.status(500).json({ message: "Failed to log in user" });
  }
});

app.post("/check-user", async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }],
    });

    if (existingUser) {
      return res.json({ exists: true });
    }

    res.json({ exists: false });
  } catch (error) {
    console.error(`Failed to check user: ${error}`);
    res.status(500).json({ message: "Failed to check user" });
  }
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
