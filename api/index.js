require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');
const { connectDB } = require("../config/db");
const cookieParser = require('cookie-parser');
const setupAssociations = require("../models/setupAssociations");
connectDB();
setupAssociations();
app.use(cors({
  credentials:true,
  origin:['http://localhost:3000','http://localhost:5000','http://localhost:5056','http://localhost:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization','Access-Control-Allow-Credentials'],
}));
app.use(cookieParser());

app.use(express.json());
app.use("/auth",require('../routes/authRoute'));
app.use("/profile",require('../routes/profileRoutes'));
app.use("/notification",require('../routes/notificationRoute'));
app.use("/notification-types",require('../routes/notificationTypeRoute'));
app.use("/leaderboard",require('../routes/leaderboardRoute'));
app.use("/payments",require('../routes/paymentsRoute'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));