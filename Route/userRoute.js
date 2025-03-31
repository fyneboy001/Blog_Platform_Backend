const express = require("express");
const route = express.Router();

//importing controller functions for use
const {
  signupUser,
  loginUser,
  getOneUser,
  deleteUser,
} = require("../Controller/userController");

//creating route for the different functions(CRUD operators)
route.post("/signup", signupUser);
route.get("/login", loginUser);
route.get("/user/:id", getOneUser);
route.delete("/user/:id", deleteUser);

//exporting the route
module.exports = route;
