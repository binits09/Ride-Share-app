const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectdb = require('./config/db');
const authRoutes = require("./routes/authRoutes");


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
connectdb();

app.use('/api/auth',authRoutes);
app.get('/',(req,res)=>{
    res.send("api is working");
});
const port = process.env.PORT || 6200;

app.listen(port,()=>{
    console.log("server is running port 6200");
});