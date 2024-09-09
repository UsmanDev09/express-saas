require("dotenv").config();
const express = require("express");
const session=require('express-session');
const passport = require('passport');
const pgStore = require("connect-pg-simple")(session);
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
app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: false })); 
app.use(express.json()); 
app.use(session({
  secret: process.env.SESSION_SECRET||'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new pgStore({
    conObject: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
    },
    tableName: "session",
  }),
  cookie: { 
    maxAge:1000*60*60*24
   }
}))
app.use(passport.initialize())
app.use(passport.session())
require('../middlewares/passport');
app.use(cookieParser());

app.use("/auth",require('../routes/authRoute'));
app.use("/profile",require('../routes/profileRoutes'));
app.use("/notification",require('../routes/notificationRoute'));
app.use("/notification-types",require('../routes/notificationTypeRoute'));
app.use("/payments",require('../routes/paymentsRoute'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));