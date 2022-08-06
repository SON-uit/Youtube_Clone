const mongoose = require("mongoose");

class mongoDbConnect {
  username;
  password;
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.connect();
  }
  connect() {
    mongoose.connect(
      `mongodb+srv://${this.username}:${this.password}@cluster0.e1xtj.mongodb.net/?retryWrites=true&w=majority`
    );
    mongoose.connection.on("open", () => {
      console.log("Mongoose connection ready");
    });
    mongoose.connection.on("error", (err) => {
      console.log(err.message);
    });
  }
}

module.exports = mongoDbConnect;
