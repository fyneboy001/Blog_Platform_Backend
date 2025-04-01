const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
//const validator = require("validator");

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
    },
    profilePhoto: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minlength: 8, //Ensures password contains atleast 8 characters
    },
    confirmPassword: {
      type: String,
      required: true,
      select: false, // This prevents it from being retrieved in queries
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    kyc: {
      type: mongoose.Types.ObjectId,
      ref: "kyc",
    },
    post: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to check if passwords match
userSchema.pre("save", function (next) {
  if (this.password !== this.confirmPassword) {
    throw new Error("Passwords do not match"); // This throws the error you're seeing
  }

  // If passwords match, hash the password
  bcrypt.hash(this.password, 10, (err, hashedPassword) => {
    if (err) return next(err);
    this.password = hashedPassword; // Save the hashed password
    this.confirmPassword = undefined; // No need to save confirmPassword in DB
    next();
  });
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
