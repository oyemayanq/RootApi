const mongoose = require("mongoose");
const config = require("config");

const mongoUri = config.get("mongoUri");

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
