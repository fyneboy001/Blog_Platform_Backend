const userModel = require("../Model/userModel");
const bcrypt = require("bcryptjs");

//Writing a function that creates a new user
const signupUser = async (req, res) => {
  //requesting the users information from the frontend
  const { password, confirmPassword, ...others } = req.body;
  console.log("Headers:", req.headers); // Log headers to check if content-type is correct
  console.log("Request Body:", req.body);

  if (!password || !confirmPassword) {
    return res.status(400).json("Please provide a password and confirm it");
  }

  if (password !== confirmPassword) {
    return res.status(400).json("Passwords do not match");
  }
  //salting the password for hashing
  const salt = bcrypt.genSaltSync(10);

  //Hashing the password passed from the frontend
  const hashPassword = await bcrypt.hash(password, salt);
  //const hashPasswordConfirm = await bcrypt.hash(confirmPassword, salt);
  console.log(hashPassword);
  //console.log(hashPasswordConfirm);

  //Checking if the email address sent from the frontend already exist
  const checkUserEmail = await userModel.findOne({ email: others.email });
  if (checkUserEmail) {
    return res.status(409).json("User already exist");
  }

  //using try, save the user information if everything is correct and catch error by sending a message back if something goes wrong
  try {
    const newUser = new userModel({ password: hashPassword, ...others });
    await newUser.save();
    return res.status(201).json("User account created successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).json("Unable to create account");
  }
};

//Exporting functions for use in the route
module.exports = { signupUser };
