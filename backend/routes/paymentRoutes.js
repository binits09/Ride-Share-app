const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const paymentCtrl = require("../controllers/paymentController");

router.post("/create-order", protect, paymentCtrl.createOrder);
router.post("/verify", protect, paymentCtrl.verifyPayment);

module.exports = router;
