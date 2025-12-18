const express = require("express");
const { chatWithAI } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/ai-chat", protect, chatWithAI);

module.exports = router;
