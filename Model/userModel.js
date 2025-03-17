const mongoose = require("mongoose");
//const validator = require("express-validator");

//creating a schema for user registration
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Name is Required"],
    },
    lastName: {
      type: String,
      required: [true, "Name is Required"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Please provide your email"],
      lowercase: true, //converts email to lowercase
      validate: [validator.isEmail, "Please provide a valid email address"], //validates if email is in the correct format
    },
    profilePhoto: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Enter a password"],
      minlength: 8, //Ensures password contains atleast 8 characters
    },
    confirmPassword: {
      type: String,
      required: [true, "Confirm your password"],
      //This validate ensures that the password and passwordConfirm are the same
      validate: {
        validator: function (el) {
          return el === this.get("password");
        },
        message: "Passwords are not the same",
      },
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
