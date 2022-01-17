const HttpError = require("../models/HttpError");
const User = require("../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const getAvatar = async (req, res, next) => {
  const uid = req.params.uid;
  let avatar = null;

  try {
    //console.log(uid);
    const user = await User.findById(uid).select("-password");
    //console.log(user);
    avatar = user.avatar;
    //console.log(avatar);
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, err.message);
    return next(error);
  }

  res.json({ avatar: avatar });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError(
      422,
      "Invalid inputs passed, please check your data."
    );
    return next(error);
  }

  const { name, email, password } = req.body;
  let user = null;
  let hashedPassword = null;

  try {
    user = await User.findOne({ email: email });
    if (user) {
      const error = new HttpError(500, "User already exists, please login.");
      return next(error);
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, err.message);
    return next(error);
  }

  const avatar = gravatar.url(email, {
    r: "pg",
    s: "200",
    d: "mm",
  });

  try {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, "Something went wrong, please try again.");
    return next(error);
  }

  user = new User({
    name: name,
    email: email,
    password: hashedPassword,
    avatar: avatar,
  });

  try {
    await user.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, "Something went wrong, please try again.");
    return next(error);
  }

  let token;

  try {
    token = jwt.sign({ uid: user._id }, config.get("tokenKey"));
  } catch (err) {
    console.loog(err);
    const error = new HttpError(500, "Something went wrong, please try again.");
    return next(error);
  }

  res.json({ token: token, uid: user._id });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError(
      422,
      "Invalid inputs passed, please check your data."
    );
    return next(error);
  }

  const { email, password } = req.body;
  let user = null;

  try {
    user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exists");
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, err.message);
    return next(error);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentails");
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, err.message);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({ uid: user._id }, config.get("tokenKey"));
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, "Something went wrong, please try again.");
    return next(error);
  }

  res.status(201).json({ token: token, uid: user._id });
};

exports.getAvatar = getAvatar;
exports.signup = signup;
exports.login = login;
