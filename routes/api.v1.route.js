const express = require("express");
const router = express.Router();

router.use("/", require("./v1/auth.route"));
router.use("/user", require("./v1/user.route"));
router.use("/role", require("./v1/role.route"));
module.exports = router;
