const express = require("express");
const authRouter = express.Router();

const controller = require("../../controllers/role.controller");
const { acceptFormData } = require("../../utils/multer");

authRouter.route("/list").get( controller.findAll);


module.exports = authRouter;
