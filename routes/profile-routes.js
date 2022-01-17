const express = require("express");

const auth = require("../middlewares/auth");
const profileControllers = require("../controllers/profile-controller");

const router = express.Router();

router.get("/:uid", profileControllers.getProfileByUserId);

router.post("/", auth, profileControllers.editProfile);

module.exports = router;
