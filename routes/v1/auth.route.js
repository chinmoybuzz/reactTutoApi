const express = require("express");
const authRouter = express.Router();

const controller = require("../../controllers/auth.controller");
const { acceptFormData } = require("../../utils/multer");

authRouter.route("/login").post( controller.login);
authRouter.route("/signup").post( controller.signup);
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
