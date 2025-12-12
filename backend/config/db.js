const mongoose = require("mongoose");

const connectdb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("mongodb conneted");
    }
    catch(err){
        console.error(err);
    }
}
module.exports = connectdb;