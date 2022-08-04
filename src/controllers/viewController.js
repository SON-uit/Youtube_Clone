class ViewController {
  constructor() {}
  renderVideoPage = (req, res) => {
    return res.render("videoPage");
  };
  renderChanelPage = (req, res) => {
    return res.render("chanelPage");
  };
  renderHome = (req, res) => {
    return res.send("Home");
  };
}
module.exports = new ViewController();
