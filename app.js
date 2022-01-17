const express = require("express");
const connectDB = require("./config/db");

const userRoutes = require("./routes/user-routes");
const postRoutes = require("./routes/post-routes");
const profileRoutes = require("./routes/profile-routes");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profile", profileRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code).json({ message: error.message });
});

connectDB();

app.listen(process.env.PORT || 5000, () => {
  console.log("Listening on port 5000");
});
