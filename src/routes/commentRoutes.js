const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const auth = require("../middleware/auth");

router.post(
  "/add/:photoId",
  auth.verifyToken,
  auth.authenticateUser,
  commentController.addComment
);

router.get("/:photoId", commentController.getAllCommentsForPhoto);

router.put(
  "/:commentId",
  auth.verifyToken,
  auth.authenticateUser,
  commentController.updateComment
);

router.delete(
  "/:commentId",
  auth.verifyToken,
  auth.authenticateUser,
  commentController.deleteComment
);

module.exports = router;
