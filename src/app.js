const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const path = require("path");

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
//local(define heplper function in views)
app.locals = require("./public/js/helper");

//middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// config auth0

//Router
const viewsRouter = require("./routers/views");
const videoApi = require("./routers/api/video.api");
app.use("/api/videos", videoApi);
app.use("/", viewsRouter);
//create server
server.listen(port, () => {
  console.log("server listening on port" + port);
});
