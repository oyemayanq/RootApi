const Profile = require("../models/Profile");
const User = require("../models/User");
const HttpError = require("../models/HttpError");

const getProfileByUserId = async (req, res, next) => {
  const uid = req.params.uid;
  let profile = null;

  try {
    profile = await Profile.findOne({ user: uid }).populate({
      path: "user",
      select: "name avatar date",
    });
    if (profile === null) {
      let tempProfile = {};
      profile = await User.findById(uid).select("-password -email");
      tempProfile.user = {
        name: profile.name,
        _id: profile._id,
        avatar: profile.avatar,
        date: profile.date,
      };
      profile = tempProfile;
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, "Something went wrong");
    return next(error);
  }

  res.json({ profile: profile });
};

const editProfile = async (req, res, next) => {
  const {
    website,
    location,
    bio,
    githubusername,
    skills,
    work,
    education,
    social,
  } = req.body;

  const uid = req.user.uid;

  let newProfile = {};

  newProfile.user = uid;
  if (website) newProfile.website = website;
  if (location) newProfile.location = location;
  if (bio) newProfile.bio = bio;
  if (githubusername) newProfile.githubusername = githubusername;
  if (skills)
    newProfile.skills = skills.split(",").map((skill) => skill.trim());
  if (work) newProfile.work = work;
  if (education) newProfile.education = education;

  newProfile.social = {};

  if (social && social.youtube) newProfile.social.youtube = social.youtube;
  if (social && social.facebook) newProfile.social.facebook = social.facebook;
  if (social && social.twitter) newProfile.social.twitter = social.twitter;
  if (social && social.instagram)
    newProfile.social.instagram = social.instagram;
  if (social && social.linkedin) newProfile.social.linkedin = social.linkedin;

  //const createdProfile = new Profile(newProfile);

  let profile = null;

  try {
    profile = await Profile.findOne({ user: uid });

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: uid },
        { $set: newProfile },
        { new: true }
      );

      //console.log(profile);
      return res.json({ profile: profile });
    }

    profile = new Profile(newProfile);
    await profile.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(500, "Something went wrong");
    return next(error);
  }

  res.json({ profile: profile });
};

exports.getProfileByUserId = getProfileByUserId;
exports.editProfile = editProfile;
