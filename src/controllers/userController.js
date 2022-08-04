/* const { requiresAuth } = require("express-openid-connect");

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
}); */
const User = require("../models/userModel");
const catchAsync = require("../helpers/catchAsync");
class UserController {
  constructor() {}
  createNewUser = async (req, res) => {
    /* const newUser = req.oidc.user;
    console.log(newUser); */
    console.log("hello");
    // const existUser = await User.find()
  };
}
module.exports = new UserController();
