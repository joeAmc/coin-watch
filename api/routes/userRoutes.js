const express = require("express");
const router = express.Router();
const User = require("../models/User");

// users
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  try {
    await user.save();

    res.status(201).json({ email });
    console.log("user successfully signed up");
  } catch (error) {
    console.error(`Failed to sign up user: ${error}`);
    res.status(500).json({ message: "Failed to sign up user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ email });
    console.log("user successfully logged in");
  } catch (error) {
    console.error(`Failed to log in user: ${error}`);
    res.status(500).json({ message: "Failed to log in user" });
  }
});

module.exports = router;
