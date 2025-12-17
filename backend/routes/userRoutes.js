const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const userUpdate = require("../controllers/userUpdate");

router.put("/me", protect, userUpdate.updateMe);
router.put("/email", protect, userUpdate.updateEmail);
router.put("/password", protect, userUpdate.updatePassword);
module.exports = router;
