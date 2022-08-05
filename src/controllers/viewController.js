const Video = require("../models/videoModel");
class ViewController {
  constructor() {}
  renderVideoPage = async (req, res) => {
    const user = req.user;
    const { slug } = req.params;
    const video = await Video.findOne({ slug: slug });
    return res.render("videoPage", { video, user });
  };
  renderChanelPage = async (req, res) => {
    const user = req.user;
    const videoOfUser = await Video.find({ uploadBy: req.user._id });
    return res.render("chanelPage", { videoOfUser, user });
  };
  renderManageVideoPage = async (req, res) => {
    const videos = await Video.find();
    console.log(videos);
    return res.render("manageVideoPage", { videos });
  };
  renderSiginPage = (req, res) => {
    return res.render("signInPage");
  };
  renderSignUpPage = (req, res) => {
    return res.render("signUpPage");
  };
}
module.exports = new ViewController();
