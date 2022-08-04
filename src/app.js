const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const path = require("path");
const { auth } = require("express-openid-connect");

const mongoDBConnect = require("./config/mongoConnection");
const User = require("./models/userModel");
dotenv.config({ path: "./.env" });
//creat server
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// connect database
const connectMongo = new mongoDBConnect(
  process.env.DB_USER,
  process.env.DB_PASSWORD
);

//middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// config auth0
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRECT,
  baseURL: "http://localhost:3000",
  clientID: process.env.AUTH0_CLIENTID,
  issuerBaseURL: `https://${process.env.AUTHO_ISSUERBASE_URL}`,
};
app.use(auth(config));
app.use(async (req, res, next) => {
  if (req.oidc.user) {
    res.locals.user = req.oidc.user;
    const exsistUser = await User.findOne({ email: req.oidc.user.email });
    if (!exsistUser) {
      const newUser = await User.create({
        email: req.oidc.user.email,
        userName: req.oidc.user.nickname,
        avatarUrl: req.oidc.user.picture,
        chanelImgUrl: req.oidc.user.picture,
      });
    }
  }
  next();
});
app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

//Router
const viewsRouter = require("./routers/views");
const videoApi = require("./routers/api/video.api");
app.use("/", viewsRouter);
app.use("/api/videos", videoApi);
//create server
server.listen(port, () => {
  console.log("server listening on port" + port);
});
