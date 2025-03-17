const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./Route/userRoute");
app.use(express.json());
app.use(userRoute);

//connecting express to database
mongoose
  .connect(
    "mongodb+srv://fyneboyfynerose:divinefavour@blog-platform-backend.tszlm.mongodb.net/Rosemary"
  )
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
