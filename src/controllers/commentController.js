const Comment = require("../models/Comment");

exports.createComment = async (req, res) => {
  try {
    const { photoId, text } = req.body;
    const userId = req.user.id;

    const commentId = await Comment.create(photoId, userId, text);
    res
      .status(201)
      .json({ message: "Comment created successfully", commentId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const commentId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    await Comment.update(commentId, userId, isAdmin, text);
    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    await Comment.delete(commentId, userId, isAdmin);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
