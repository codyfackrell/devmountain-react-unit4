const { sequelize } = require("./util/database");
const { User } = require("./models/user");
const { Post } = require("./models/post");

require("dotenv").config();
const { PORT } = process.env;

const express = require("express");
const cors = require("cors");

const { register, login } = require("./controllers/auth");
const {
  getAllPosts,
  getCurrentUserPosts,
  addPost,
  editPost,
  deletePost,
} = require("./controllers/posts");
const { isAuthenticated } = require("./middleware/isAuthenticated");

User.hasMany(Post);
Post.belongsTo(User);

const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", register);
app.post("/login", login);

app.get("/posts", getAllPosts);
app.get("/userposts/:userId", getCurrentUserPosts);

app.post("/posts", isAuthenticated, addPost);
app.put("/posts/:id", isAuthenticated, editPost);
app.delete("/posts/:id", isAuthenticated, deletePost);

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  })
  .catch((err) => console.log(err));