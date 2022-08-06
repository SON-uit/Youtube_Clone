const express = require("express");
const VideoController = require("../../controllers/videoController");
const multerUpload = require("../../config/multer.config");
const router = express.Router();

router.post(
  "/",
  multerUpload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnailImg", maxCount: 1 },
  ]),
  VideoController.createNewVideo
);
router.put(
  "/:videoId",
  multerUpload.single("thumbnailImg"),
  VideoController.uploadVideo
);
router.delete("/:id", VideoController.deleteVideo);

module.exports = router;
