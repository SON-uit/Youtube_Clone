const express = require("express");
const ViewController = require("../controllers/viewController");
const { requiresAuth } = require("express-openid-connect");
const router = express.Router();

router.get("/chanelPage", ViewController.renderChanelPage);
router.get("/video/:slug", ViewController.renderVideoPage);
router.get("/manage", ViewController.renderManageVideoPage);
router.get("/sign-in", ViewController.renderSiginPage);
router.get("/sign-up", ViewController.renderSignUpPage);
module.exports = router;
