const express = require("express");
const VideoController = require("../../controllers/videoController");
const multerUpload = require("../../config/multer.config");
const router = express.Router();

router.post(
  "/",
  multerUpload.single("videoFile"),
  VideoController.createNewVideo
);
router.put(
  "/:id",
  multerUpload.single("videoFile"),
  VideoController.uploadVideo
);
router.delete("/:id", VideoController.deleteVideo);
module.exports = router;
