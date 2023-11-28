const express = require("express");
const router = express.Router();

const InstallController = require("../controller/install_controller");

router.get("/", InstallController.install);

module.exports = router;
