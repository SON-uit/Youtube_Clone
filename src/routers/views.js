const express = require("express");
const ViewController = require("../controllers/viewController");
const router = express.Router();

router.get("/chanelPage", ViewController.renderChanelPage);
router.get("/videoPage", ViewController.renderVideoPage);
//router.get("/", ViewController.renderHome);
module.exports = router;
