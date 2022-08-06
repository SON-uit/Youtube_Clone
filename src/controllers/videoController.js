const Mux = require("@mux/mux-node");
const slugify = require("slugify");
const mongoose = require("mongoose");

const cloudinary = require("../config/cloudinaryConnection");
const Video = require("../models/videoModel");
const catchAsync = require("../helpers/catchAsync");

class VideoController {
  constructor() {}
  //conver file from client to filePath and fileName
  convertFile = (file) => {
    const fileName = file.originalname.split(".")[0];
    const filePath = file.path;
    return {
      fileName,
      filePath,
    };
  };
  // upload video to Mux
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
  createNewVideo = catchAsync(async (req, res) => {
    const { name, description, tags, uploadBy } = req.body;
    const files = req.files;
    if (files) {
      //get video and images file
      const videoFile = files.videoFile[0];
      const thumbnailImg = files.thumbnailImg[0];

      //upload thumbnail images to Cloudinary
      const convertImg = this.convertFile(thumbnailImg);
      const uploadImg = await cloudinary.uploadImage(
        convertImg.filePath,
        convertImg.fileName
      );
      // upload video to Cloudinary
      const convertVideo = this.convertFile(videoFile);
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
        thumbnailImg: uploadImg.url,
        tags: tags.split(","),
        description,
        uploadBy,
      });
      return res.send(newVideo);
    }
  });
  uploadVideo = catchAsync(async (req, res, next) => {
    const { videoId } = req.params;
    const { name, description } = req.body;
    const uploadOptions = {
      name: name.trim(),
      description: description.trim(),
      slug: slugify(name, {
        lower: true,
      }),
    };
    // upload new user avatar(if have)
    if (req.file) {
      const convertImg = this.convertFile(req.file);
      const uploadImg = await cloudinary.uploadImage(
        convertImg.filePath,
        convertImg.fileName
      );
      uploadOptions.thumbnailImg = uploadImg.url;
    }
    const updatedVideo = await Video.findOneAndUpdate(
      { _id: videoId },
      { $set: uploadOptions },
      { new: true }
    );
    return res.status(200).json({
      status: "Success",
      data: updatedVideo,
    });
  });
  deleteVideo = catchAsync(async (req, res) => {
    //set isActive to false
    const { id } = req.params;
    const changeVideoStatus = await Video.findOneAndUpdate(
      { _id: id },
      { $set: { isActive: false } },
      { new: true }
    );
    return res.status(200).json({
      status: "Success",
      data: changeVideoStatus,
    });
  });
}
module.exports = new VideoController();
