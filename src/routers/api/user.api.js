const express = require("express");
const axios = require("axios");
const authController = require("../../controllers/authController");
const userController = require("../../controllers/userController");
const multerUpload = require("../../config/multer.config");
const router = express.Router();

router.post("/signIn", authController.signIn);
router.post("/signUp", authController.signUp);
router.get("/logout", authController.logout);

router.put("/:id", multerUpload.single("avatarImg"), userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
