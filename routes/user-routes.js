const express = require("express");
const { check } = require("express-validator");

const userControllers = require("../controllers/user-controller");

const router = express.Router();

router.get("/avatar/:uid", userControllers.getAvatar);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").not().isEmpty(),
    check("password").not().isEmpty(),
  ],
  userControllers.signup
);
router.post(
  "/login",
  [check("email").not().isEmpty(), check("password").not().isEmpty()],
  userControllers.login
);

module.exports = router;
