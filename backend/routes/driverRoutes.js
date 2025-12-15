const express = require("express");
const { registerDriver } = require("../controllers/authController");

const router = express.Router();
router.post("/register", registerDriver);

module.exports = router;
