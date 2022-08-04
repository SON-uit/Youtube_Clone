const mongoose = require("mongoose");
const slugify = require("slugify");

const VideoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your video name"],
  },
  sourceUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  uploadBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  uploadDate: {
    type: Date,
    default: new Date(Date.now()),
  },
  slug: {
    type: String,
    default: function () {
      return slugify(this.name, {
        lower: true,
      });
    },
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
});
const Video = mongoose.model("Video", VideoSchema);
module.exports = Video;
