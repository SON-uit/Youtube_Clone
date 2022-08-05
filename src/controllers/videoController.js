const Mux = require("@mux/mux-node");
const cloudinary = require("../config/cloudinaryConnection");
const Video = require("../models/videoModel");
class VideoController {
  constructor() {}
  convertFile = (file) => {
    const fileName = file.originalname.split(".")[0];
    const filePath = file.path;
    return {
      fileName,
      filePath,
    };
  };
  uploadToMux = async (videoUrl) => {
    const { Video } = new Mux(
      process.env.MUX_ACCESS_TOKEN,
      process.env.MUX_SECRECT_KEY
    );
    const asset = await Video.Assets.create({
      input: videoUrl,
      playback_policy: "public",
    });
    return asset;
  };
  createNewVideo = async (req, res) => {
    const { name, description } = req.body;
    if (req.file) {
      // upload to Cloudinary
      const convertVideo = this.convertFile(req.file);
      const uploadVideo = await cloudinary.uploadVideo(
        convertVideo.filePath,
        convertVideo.fileName
      );
      //store video in Mux
      const asset = await this.uploadToMux(uploadVideo.url);
      // store data in database
      const newVideo = await Video.create({
        name,
        assetId: asset.id,
        playbackIds: asset.playback_ids[0].id,
        description,
        uploadBy: "62ebed0af51e205b2c998278",
      });
      return res.send(newVideo);
    }
  };
}
module.exports = new VideoController();
