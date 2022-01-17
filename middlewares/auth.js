const jwt = require("jsonwebtoken");
const config = require("config");
const HttpError = require("../models/HttpError");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("Authentication failed.");
    }

    const payload = jwt.verify(token, config.get("tokenKey"));

    req.user = payload;
    next();
  } catch (err) {
    console.log(err);
    const error = new HttpError(401, "Authentication failed, please login.");
    return next(error);
  }
};

module.exports = auth;
