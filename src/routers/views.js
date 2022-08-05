const express = require("express");
const ViewController = require("../controllers/viewController");
const { requiresAuth } = require("express-openid-connect");
const router = express.Router();

router.use((req, res, next) => {
  if (!req.oidc.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
});
router.get("/chanelPage", ViewController.renderChanelPage);
router.get("/video/:slug", ViewController.renderVideoPage);
module.exports = router;
