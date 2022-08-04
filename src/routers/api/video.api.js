const express = require("express");
const VideoController = require("../../controllers/videoController");
const multerUpload = require("../../config/multer.config");
const router = express.Router();

router.post(
  "/",
  multerUpload.single("videoFile"),
  VideoController.createNewVideo
);
module.exports = router;
