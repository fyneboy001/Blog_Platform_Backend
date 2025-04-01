const jwt = require("jsonwebtoken");
const postModel = require("../Model/postModel");
const userModel = require("../Model/userModel"); // Assuming a user model exists
const commentModel = require("../Model/commentModel"); // Assuming a comment model exists

// Create a Post
const createPost = async (req, res) => {
  const { token } = req.cookies;
  const { postTitle, postBody, media } = req.body;

  try {
    const { id: creatorId } = jwt.verify(token, process.env.JWT_SECRET);

    const newPost = new postModel({
      postTitle,
      postBody,
      media,
      creatorId,
    });

    await newPost.save();
    res
      .status(201)
      .json({ message: "Post Created Successfully", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a Single Post
const getSinglePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await postModel.findById(id).populate("comments");
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.cookie("id", post._id, { httpOnly: true }).status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get All Posts
const getAllPosts = async (req, res) => {
  try {
    const allPosts = await postModel.find().populate("comments");
    res.status(200).json(allPosts);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update a Post
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;
  const { postTitle, postBody, media } = req.body;

  try {
    const { id: creatorId } = jwt.verify(token, process.env.JWT_SECRET);

    const post = await postModel.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.creatorId.toString() !== creatorId) {
      return res
        .status(403)
        .json({ error: "You can only update your own post" });
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      id,
      { postTitle, postBody, media },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a Post
const deletePost = async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;

  try {
    const { id: creatorId } = jwt.verify(token, process.env.JWT_SECRET);

    const post = await postModel.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.creatorId.toString() !== creatorId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own post" });
    }

    await postModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Like/Unlike a Post
const likePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await postModel.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.likes += 1;
    await post.save();

    res.status(200).json({ message: "Post liked", likes: post.likes });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Add a Comment
const addComment = async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;
  const { comment } = req.body;

  try {
    const { id: userId } = jwt.verify(token, process.env.JWT_SECRET);

    const newComment = new commentModel({
      userId,
      postId: id,
      comment,
    });

    await newComment.save();

    await postModel.findByIdAndUpdate(id, {
      $push: { comments: newComment._id },
    });

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Share a Post (Placeholder for sharing logic)
const sharePost = async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;
  const { platform } = req.body;

  try {
    const { id: userId } = jwt.verify(token, process.env.JWT_SECRET);
    const post = await postModel.findById(id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    post.share[userId] = platform;
    await post.save();

    res.status(200).json({ message: "Post shared", shareData: post.share });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createPost,
  getSinglePost,
  getAllPosts,
  updatePost,
  deletePost,
  likePost,
  addComment,
  sharePost,
};
