const userModel = require("../Model/userModel");
const jwt = require("jsonwebtoken");
//const bcrypt = require("bcryptjs");

//Writing a function that creates a new user
const signupUser = async (req, res) => {
  //requesting the users information from the frontend
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  console.log(req.body);
  // console.log("Headers:", req.headers); // Log headers to check if content-type is correct
  // console.log("Request Body:", req.body);

  if (!password || !confirmPassword || !firstName || !lastName || !email) {
    return res.status(400).json("All fields are required");
  }

  //Checking password length
  if (password.length < 8) {
    return res.status(403).json("Provide a stronger password");
  }

  if (password !== confirmPassword) {
    return res.status(400).json("Passwords do not match");
  }
  //salting the password for hashing
  //const salt = bcrypt.genSaltSync(10);

  //Hashing the password passed from the frontend
  //const hashPassword = await bcrypt.hash(password, salt);
  //const hashPasswordConfirm = await bcrypt.hash(confirmPassword, salt);
  //console.log(hashPassword);
  //console.log(hashPasswordConfirm);

  //Checking if the email address sent from the frontend already exist
  const checkUserEmail = await userModel.findOne({ email });
  if (checkUserEmail) {
    return res.status(409).json("User already exist");
  }

  //using try, save the user information if everything is correct and catch error by sending a message back if something goes wrong
  try {
    const newUser = new userModel({
      password,
      confirmPassword,
      firstName,
      lastName,
      email,
    });
    await newUser.save();
    return res.status(201).json("User account created successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).json("Unable to create account");
  }
};

//Generating a function to login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  //Checking if email or password was sent from the frontend
  if (!email || !password) {
    return res.status(400).json("Please provide valid credentials");
  }

  //checking is new user has an existing account
  const validateUser = await userModel.findOne({ email });
  if (!validateUser) {
    return res.status(404).json("User not found: Please create an account");
  }

  //Checking if user password matches saved password
  const validatePassword = await userModel.findOne({
    password: validateUser.password,
  });
  if (!validatePassword) {
    return res.status(400).json("Invalid Password");
  }

  //Generating jsonwebtoken
  const token = jwt.sign({ id: validateUser.id }, process.env.JWT_SECRET);

  //returning the user webpage when all validations are met
  res.cookie("token", token, { httpOnly: true }).status(200).json(validateUser);
};

//function to get a single user
const getOneUser = async (req, res) => {
  const { id } = req.params;

  try {
    const oneUser = await userModel.findById(id);
    return res.status(200).json(oneUser);
  } catch (error) {
    res.status(500).json("Something went Wrong");
  }
};

//Function to delete User
const deleteUser = async (req, res) => {
  const { token } = req.cookies;
  console.log(req.cookies);
  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  try {
    const user = await userModel.findByIdAndDelete({ creatorId: id });
    return res.status(200).json("User Account Deleted Successfully");
  } catch (error) {
    return res.status(500).json("Something went wrong");
  }
};

//Exporting functions for use in the route
module.exports = { signupUser, loginUser, getOneUser, deleteUser };
