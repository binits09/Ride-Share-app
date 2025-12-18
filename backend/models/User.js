const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true,unique:true },
        password: { type: String, required: true },
        gender: { type: String, enum: ["male", "female", "other"], required: true },
        isBlocked: { type: Boolean, default: false },
        isAdmin: { type: Boolean, default: false }
       
    },
    { timestamps: true }
    
);
module.exports = mongoose.model('User',userschema);