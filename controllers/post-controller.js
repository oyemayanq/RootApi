const { validationResult } = require("express-validator");

const Post = require("../models/Post");
const User = require("../models/User");
const HttpError = require("../models/HttpError");

const getAllPosts = async (req, res, next) => {
  let posts = null;
  try {
    posts = await Post.find().sort({ date: -1 }).populate({
      path: "user",
      select: "name avatar",
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, "Something went wrong");
    return next(error);
  }

  res.json({ posts: posts });
};

const getPostById = async (req, res, next) => {
  let post = null;
  const id = req.params.postId;
  try {
    post = await Post.findById(id).populate({
      path: "user",
      select: "name avatar",
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, "Something went wrong");
    return next(error);
  }

  res.json({ post: post });
};

const getPostsByUserId = async (req, res, next) => {
  const uid = req.params.uid;

  try {
    const posts = await Post.find({ user: uid }).populate({
      path: "user",
      select: "name avatar",
    });

    res.json({ posts: posts });
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, "Something went wrong");
    return next(error);
  }
};

const createPost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError(
      422,
      "Invalid inputs passed, please check your data."
    );
    return next(error);
  }

  const { title, content } = req.body;
  const uid = req.user.uid;
  let user = null;

  try {
    user = await User.findById(uid).select("-password");
    if (!user) {
      throw new Error("Invalid request");
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, err.message);
    return next(error);
  }

  let newPost = new Post({
    user: uid,
    title: title,
    content: content,
  });

  try {
    await newPost.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, err.message);
    return next(error);
  }

  res.status(201).json({ post: newPost });
};

const deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  const uid = req.user.uid;
  let post;

  try {
    post = await Post.findById(postId);
    if (post.user.toString() !== uid) {
      throw new Error("Invalid request");
    }
    await post.remove();
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, err.message);
    return next(error);
  }

  res.json({ msg: "Post deleted" });
};

const addComment = async (req, res, next) => {
  const uid = req.user.uid;
  const commentText = req.body.commentText;
  const postId = req.params.postId;

  let user = null;
  let post = null;

  try {
    user = await User.findById(uid).select("-password");
    if (!user) {
      throw new Error("User not found, please login");
    }

    post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const newComment = {
      user: uid,
      text: commentText,
      name: user.name,
      avatar: user.avatar,
    };

    post.comments.unshift(newComment);

    await post.save();

    //console.log(post.comments);
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, err.message);
    return next(error);
  }

  res.json({ comments: post.comments });
};

const deleteComment = async (req, res, next) => {
  const uid = req.user.uid;
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  let post = null;
  let newComments = [];

  try {
    post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found.");
    }

    for (let i = 0; i < post.comments.length; i++) {
      if (post.comments[i].id === commentId) {
        if (post.comments[i].user.toString() === uid) {
          continue;
        } else {
          throw new Error("Invalid request");
        }
      }

      newComments.push(post.comments[i]);
    }

    post.comments = newComments;
    await post.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, err.message);
    return next(error);
  }

  res.json({ comments: post.comments });
};

const likePost = async (req, res, next) => {
  const uid = req.user.uid;
  const postId = req.params.postId;

  let post = null;

  try {
    post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    let index = null;
    let newLikes = [];

    for (let i = 0; i < post.likes.length; i++) {
      if (post.likes[i].user.toString() === uid) {
        index = i;
        continue;
      }
      newLikes.push(post.likes[i]);
    }

    if (index === null) {
      newLikes.push({ user: uid });
    }

    post.likes = newLikes;

    await post.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, err.message);
    return next(error);
  }

  res.json({ likes: post.likes });
};

exports.getAllPosts = getAllPosts;
exports.getPostById = getPostById;
exports.getPostsByUserId = getPostsByUserId;
exports.createPost = createPost;
exports.deletePost = deletePost;
exports.addComment = addComment;
exports.deleteComment = deleteComment;
exports.likePost = likePost;
