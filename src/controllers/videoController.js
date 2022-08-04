const cloudinary = require("../config/cloudinaryConnection");
const axios = require("axios");
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
      try {
        const response = await axios({
          method: "POST",
          url: "https://api.mux.com/video/v1/assets",
          data: {
            input: [
              {
                url: uploadVideo.url,
              },
            ],
            playback_policy: ["public"],
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `${process.env.MUX_ACCESS_TOKEN}:${process.env.MUX_SECRECT_KEY}`,
          },
        });
        return res.send(response);
      } catch (e) {
        console.log(e);
      }
      // store data in database
    }
  };
}
module.exports = new VideoController();
