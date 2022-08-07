const catchAsync = require("../helpers/catchAsync");
const User = require("../models/userModel");
const cloudinary = require("../config/cloudinaryConnection");

class UserController {
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

  // updateUser
  updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
    const uploadOptions = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      userName: `${lastName} ${firstName}`,
    };
    // upload new user avatar(if have)
    if (req.file) {
      const convertImg = this.convertFile(req.file);
      const uploadImg = await cloudinary.uploadImage(
        convertImg.filePath,
        convertImg.fileName
      );
      uploadOptions.avatarUrl = uploadImg.url;
    }
    const updateUser = await User.findOneAndUpdate(
      { _id: id },
      { $set: uploadOptions },
      { new: true }
    );
    return res.status(200).json({
      status: "Success",
      data: updateUser,
    });
  });

  // delete user
  deleteUser = catchAsync(async (req, res) => {
    // set isActive to false
    const { id } = req.params;
    const changeUserStatus = await User.findOneAndUpdate(
      { _id: id },
      { $set: { isActive: false } },
      { new: true }
    );
    res.cookie("jwt", null, {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
    });
    return res.status(200).json({
      status: "Success",
      data: changeUserStatus,
    });
  });
}

module.exports = new UserController();
