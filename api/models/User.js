const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  coins: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coin",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
