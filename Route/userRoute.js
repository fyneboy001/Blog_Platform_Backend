const express = require("express");
const route = express.Router();

//importing controller functions for use
const { signupUser } = require("../Controller/userController");

//creating route for the different functions(CRUD operators)
route.post("/signup", signupUser);

//exporting the route
module.exports = route;
