const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const route = express.Router();

const app = express();

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

route.post("/signup", async (req, res) => {
  console.log("signup route hit");
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

route.post("/login", async (req, res) => {
  console.log("login route hit");
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

route.post("/check-user", async (req, res) => {
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

module.exports = route;
