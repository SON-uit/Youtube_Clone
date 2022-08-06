const dotenv = require("dotenv");
const express = require("express");

const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoDBConnect = require("./config/mongoConnection");

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
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Router
const viewsRouter = require("./routers/views");
const videoApi = require("./routers/api/video.api");
const userApi = require("./routers/api/user.api");

app.use("/api/videos", videoApi);
app.use("/api/users/", userApi);
app.use("/", viewsRouter);

//Errorr Handler
app.use((err, req, res, next) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
//create server
server.listen(port, () => {
  console.log("server listening on port" + port);
});
