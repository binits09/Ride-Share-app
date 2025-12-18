const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectdb = require('./config/db');
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const driverRoutes = require("./routes/driverRoutes");
const rideRoutes = require("./routes/rideRoutes");



dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectdb();

app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/drivers',driverRoutes);
app.use('/api/rides',rideRoutes);
app.get('/',(req,res)=>{
    res.send("api is working");
});
const port = process.env.PORT || 6200;

app.listen(port,()=>{
    console.log("server is running port 6200");
});