const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
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
    default:
      "https://res.cloudinary.com/dnyieivv3/image/upload/v1659751995/Youtube_Clone/defaultAvatar_vhkkjw.png",
  },
  chanelImgUrl: {
    type: String,
    default:
      "https://res.cloudinary.com/dnyieivv3/image/upload/v1659751995/Youtube_Clone/defaultAvatar_vhkkjw.png",
  },
  isActive: {
    type: Boolean,
    default: true,
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
