const jwt = require("jsonwebtoken");
const postModel = require("../Model/postModel");

//creating a Post
const createPost = async (req, res) => {
  const { token } = req.cookies;
  console.log(req.cookies);
  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  const body = req.body;

  try {
    const newPost = new postModel({ ...body, creatorId: id });
    await newPost.save();
    res.status(201).json("Post Created Successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json("something went wrong");
  }
};

//Function to get a single post
const getSinglePost = async (req, res) => {
  const { id } = req.params;

  try {
    const onePost = await postModel.findById(id);
    return res
      .cookie("id", getSinglePost.id, { httpOnly: true })
      .status(200)
      .json(onePost);
  } catch (error) {
    return res.status(500).json("something went wrong");
  }
};

//Get all post
const getAllPost = async (req, res) => {
  try {
    const allPost = await postModel.find();
    return res.status(201).json(allPost);
  } catch (error) {
    return res.status(500).json("Something went wrong");
  }
};

//Function to update a post
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { creatorId, id: postId, ...others } = req.body;

  try {
    //Get post to be updated
    const Post = await postModel.findById(id);
    if (!Post) {
      return res.status(404).json("Post not found");
    }

    //Check if the creator of the post is same as who is requesting to update the post
    if (Post.creatorId.toString() !== creatorId) {
      return res.status(403).json("Post does not belong to you");
    }

    //Now updatepost when all validations are met
    await postModel.findByIdAndUpdate(id, { ...others }, { now: true });
    return res.status(200).json("Post updated Successfully");
  } catch (error) {
    return res.status(500).json("Something went wrong");
  }
};

//Function to DeletePost
const deletePost = async (req, res) => {
  const { creatorId } = req.body;
  const { id } = req.params;

  try {
    //check and get the post to be deleted
    const post = await postModel.findById(id);

    //return a message if post does not exist
    if (!post) {
      return res.status(404).json("Post not found");
    }

    //check if the post creatorId is same as the one requesting to delete the post
    if (post.creatorId.toString() !== creatorId) {
      return res
        .status(403)
        .json("Post can't be deleted as it does not belong to you");
    }

    //if all validations are met, proceed to delete post
    await postModel.findByIdAndDelete(id);
    return res.status(200).json("Post Deleted Successfully");
  } catch (error) {
    return res.status(500).json("Something went wrong");
  }
};

module.exports = {
  createPost,
  getSinglePost,
  getAllPost,
  updatePost,
  deletePost,
};
