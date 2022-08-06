const express = require("express");
const ViewController = require("../controllers/viewController");
const AuthController = require("../controllers/authController");
const router = express.Router();

router.get("/sign-in", ViewController.renderSiginPage);
router.get("/sign-up", ViewController.renderSignUpPage);

router.use(AuthController.checkIsAuth);
router.get("/chanelPage", ViewController.renderChanelPage);
router.get("/video/:slug", ViewController.renderVideoPage);
router.get("/manage", ViewController.renderManageVideoPage);
router.get("/user/:id/setting", ViewController.renderUserSettingPage);
router.get("/createVideo/", ViewController.renderCreateVideoPage);
router.get("/upDateVideo/:videoId", ViewController.renderUpDateVideoPage);
module.exports = router;
