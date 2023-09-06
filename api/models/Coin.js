const mongoose = require("mongoose");

const coinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  ticker: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: async function(userId) {
        const user = await mongoose.model("User").findById(userId);
        return !!user;
      },
      message: "Invalid user ID",
    },
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Coin = mongoose.model("Coin", coinSchema);

module.exports = Coin;
