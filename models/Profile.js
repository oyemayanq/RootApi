const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  bio: {
    type: String,
  },
  githubusername: {
    type: String,
  },
  skills: {
    type: [String],
  },
  work: {
    type: String,
  },
  education: {
    type: String,
  },
  social: {
    youtube: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    twitter: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
