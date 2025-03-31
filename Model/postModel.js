const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postTitle: {
    type: String,
    required: true,
  },
  postBody: {
    type: String,
    required: true,
  },
  creatorId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  media: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  share: {},
});

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;
