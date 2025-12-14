const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true,unique:true },
        password: { type: String, required: true },
        gender: { type: String, enum: ["male", "female", "other"], required: true },
        role: { type: String, enum: ["user", "driver"], default: "user", },

        vehicleModel: {
    type: String,
    required: function () {
      return this.role === "driver";
    },
  },

  vehicleNumber: {
    type: String,
    required: function () {
      return this.role === "driver";
    },
  },

  licenseNumber: {
    type: String,
    required: function () {
      return this.role === "driver";
    },
  },
       
    },
    { timestamps: true }
    
);
module.exports = mongoose.model('User',userschema);