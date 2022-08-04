const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
  },
  userName: {
    type: String,
    required: [true, "Please provide your name"],
  },
  avatarUrl: {
    type: String,
  },
  chanelImgUrl: {
    type: String,
  },
  followings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
