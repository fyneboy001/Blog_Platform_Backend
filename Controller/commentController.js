const commentModel = require("../Model/commentModel");
const likeModel = require("../Model/likeModel");
const postModel = require("../Model/postModel");

//Function to add a comment to a post
const addComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const { userId } = req.cookies;

  try {
    //Adding the comment and saving it
    const newComment = new commentModel({ postId, userId, content });
    await newComment.save();

    //Saving the above comment to the post
    const post = await postModel.findById(postId);
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
};

//Adding Likes to a Post
const likePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.cookies;

  try {
    //Checking if user already liked the post
    const alreadyLiked = await likeModel.findById(userId);
    if (alreadyLiked) {
      return res.status(403).json("User already liked this post");
    }

    //Saving the like
    const like = new likeModel({ postId, userId });
    await like.save();

    //Updating the like count array
    const post = await postModel.findById(postId);
    post.likes += 1;
    await post.save();

    return res.status(201).json(like);
  } catch (error) {
    res.status(500).json("Something went Wrong");
  }
};

// Get all comments for a post
const getAllComments = async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await commentModel.find({ postId }).populate("postId");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { addComment, getAllComments, likePost };
