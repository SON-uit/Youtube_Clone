const express = require("express");
const ViewController = require("../controllers/viewController");
const AuthController = require("../controllers/authController");
const router = express.Router();

router.get("/sign-in", ViewController.renderSiginPage);
//verify page
router.get("/verifyAccount", ViewController.renderVerifyAccountPage);

router.get("/sign-up", ViewController.renderSignUpPage);

router.get("/sendBird", ViewController.renderSendBirdPage);
router.use(AuthController.checkIsAuth);
//home route
router.get("/", ViewController.renderChanelPage);
// detail video route
router.get("/video/:slug", ViewController.renderVideoPage);
// manage video route
router.get("/manage", ViewController.renderManageVideoPage);
// user setting profile route
router.get("/user/:id/setting", ViewController.renderUserSettingPage);
// create video route
router.get("/createVideo/", ViewController.renderCreateVideoPage);
// update video route
router.get("/upDateVideo/:videoId", ViewController.renderUpDateVideoPage);

module.exports = router;
