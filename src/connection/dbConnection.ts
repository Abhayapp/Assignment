import mongoose from "mongoose";
const url = "mongodb://localhost:27017/project";

mongoose.connect(url);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:")); //event Listener
db.once("open", function () {
  console.log("Connection Successful!");
});

export default db;
