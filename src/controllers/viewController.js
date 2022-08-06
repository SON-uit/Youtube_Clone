const Video = require("../models/videoModel");
const User = require("../models/userModel");
const catchAsync = require("../helpers/catchAsync");
class ViewController {
  constructor() {}
  //render Video Page
  renderVideoPage = catchAsync(async (req, res) => {
    const user = req.user;
    const { slug } = req.params;
    const video = await Video.findOne({ slug: slug });
    return res.render("videoPage", { video, user });
  });
  // render chanel page
  renderChanelPage = catchAsync(async (req, res) => {
    const user = req.user;
    const videoOfUser = await Video.find({ uploadBy: req.user._id });
    return res.render("chanelPage", { videoOfUser, user });
  });
  // render manage video page
  renderManageVideoPage = catchAsync(async (req, res) => {
    const videos = await Video.find();
    return res.render("manageVideoPage", { videos });
  });
  // render sign in page
  renderSiginPage = (req, res) => {
    return res.render("signInPage");
  };
  // render sign up page
  renderSignUpPage = (req, res) => {
    return res.render("signUpPage");
  };
  // render user setting page
  renderUserSettingPage = async (req, res) => {
    const user = req.user;
    return res.render("settingUserPage", { user });
  };
}
module.exports = new ViewController();
