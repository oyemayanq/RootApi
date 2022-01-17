const express = require("express");
const { check } = require("express-validator");
const auth = require("../middlewares/auth");
const postController = require("../controllers/post-controller");

const router = express.Router();

router.get("/", postController.getAllPosts);
router.get("/:postId", postController.getPostById);
router.get("/user/:uid", postController.getPostsByUserId);
router.post(
  "/",
  auth,
  [check("title").not().isEmpty(), check("content").not().isEmpty()],
  postController.createPost
);
router.delete("/:postId", auth, postController.deletePost);
router.post("/comments/:postId", auth, postController.addComment);
router.delete(
  "/comments/:postId/:commentId",
  auth,
  postController.deleteComment
);
router.put("/likes/:postId", auth, postController.likePost);

module.exports = router;
