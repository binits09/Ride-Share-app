const Razorpay = require("razorpay");
const crypto = require("crypto");
const Ride = require("../models/Ride");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { rideId } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    const options = {
      amount: ride.fare * 100, // paise
      currency: "INR",
      receipt: `ride_${ride._id}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create payment order" });
  }
};

// VERIFY PAYMENT (supports Razorpay signature or cash)
exports.verifyPayment = async (req, res) => {
  try {
    const { rideId, orderId, paymentId, signature } = req.body;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (ride.status === "paid") {
      return res.status(400).json({ message: "Ride already paid" });
    }

    if (ride.status !== "completed") {
      return res.status(400).json({ message: "Ride must be completed before payment" });
    }

    // If Razorpay fields are provided, verify signature
    if (orderId && paymentId && signature) {
      if (!process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({ message: "Server payment config missing" });
      }
      const body = `${orderId}|${paymentId}`;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature !== signature) {
        return res.status(400).json({ message: "Payment verification failed (invalid signature)" });
      }
    }

    // Mark paid (cash or verified Razorpay)
    ride.status = "paid";
    ride.paymentMethod = orderId && paymentId && signature ? "razorpay" : "cash";
    await ride.save();

    res.json({ message: "Payment successful", ride });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to verify payment" });
  }
};