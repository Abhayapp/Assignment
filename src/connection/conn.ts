import mongoose from "mongoose";
var url = "mongodb://localhost:27017/project";

mongoose.connect(url);
var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:")); //event Listener
db.once("open", function () {
  //Event listener
  console.log("Connection Successful!");
});

export default db;
