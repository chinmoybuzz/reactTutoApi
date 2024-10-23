const express = require("express");
const authRouter = express.Router();

const controller = require("../../controllers/user.controller");
const { acceptFormData } = require("../../utils/multer");

authRouter.route("/list").get( controller.findAllData);
// authRouter.route("/add").post(acceptFormData, controller.signup);
// authRouter.route("/user-login").post(acceptFormData, controller.userLogin);
// authRouter
//   .route("/verify-token")
//   .post(acceptFormData, authenticate, controller.verifyToken);
// authRouter
//   .route("/refreshToken")
//   .post(acceptFormData, authenticate, controller.refreshToken);

// authRouter.route("/send-otp").post(acceptFormData, controller.sendOtp);
// authRouter.route("/verify-otp").post(acceptFormData, controller.verifyOtp);
// authRouter
//   .route("/reset-password")
//   .post(acceptFormData, controller.resetPassword);

module.exports = authRouter;
