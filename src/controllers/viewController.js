const Video = require("../models/videoModel");
const User = require("../models/userModel");
const catchAsync = require("../helpers/catchAsync");
class ViewController {
  constructor() {}
  //render Video Page
  renderVideoPage = catchAsync(async (req, res) => {
    const user = req.user;
    const { slug } = req.params;
    const video = await Video.findOne({ slug: slug, isActive: true });
    const relativeVideo = await Video.find({
      tags: { $in: video.tags },
      _id: { $ne: video._id },
      isActive: true,
    }).populate("uploadBy");
    return res.render("videoPage", { video, user, relativeVideo });
  });
  // render chanel page
  renderChanelPage = catchAsync(async (req, res) => {
    const user = req.user;
    const videoOfUser = await Video.find({
      uploadBy: req.user._id,
      isActive: true,
    });
    return res.render("chanelPage", { videoOfUser, user });
  });
  // render manage video page
  renderManageVideoPage = catchAsync(async (req, res) => {
    const user = req.user;
    const videos = await Video.find({ uploadBy: req.user._id, isActive: true });
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
  // render create video page
  renderCreateVideoPage = async (req, res) => {
    const user = req.user;
    return res.render("createVideoPage", { user });
  };
  // render upload video page
  renderUpDateVideoPage = catchAsync(async (req, res) => {
    const { videoId } = req.params;
    const video = await Video.findOne({ _id: videoId });
    return res.render("upDateVideoPage", { video });
  });
}
module.exports = new ViewController();
