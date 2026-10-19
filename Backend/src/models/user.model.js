const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username already taken"],
    required: true,
  },

  email: {
    type: String,
    unique: [true, "Account already exists"],
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
