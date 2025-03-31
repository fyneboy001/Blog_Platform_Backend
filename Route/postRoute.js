const express = require("express");
const route = express.Router();

//importing the controller functions
const {
  createPost,
  getSinglePost,
  getAllPost,
  updatePost,
  deletePost,
} = require("../Controller/postController");
const {
  addComment,
  getAllComments,
  likePost,
} = require("../Controller/commentController");
//CRUD Operators
route.post("/post", createPost);
route.get("/post/:id", getSinglePost);
route.get("/post", getAllPost);
route.put("/post/:id", updatePost);
route.delete("/post/:id", deletePost);
route.post("/comment", addComment);
route.get("/comment", getAllComments);
route.post("/like", likePost);

module.exports = route;
