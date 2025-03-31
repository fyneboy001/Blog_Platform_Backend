const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./Route/userRoute");
const postRoute = require("./Route/postRoute");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
app.use(userRoute);
app.use(postRoute);
require("dotenv").config();

//connecting express to database
const { MONGODB_URL } = process.env;
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch(() => {
    console.log("Error connecting to databse");
  });

//listening to port 8000
app.listen(8000, () => {
  console.log("Server is running");
});
