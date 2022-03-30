import mongoose from "mongoose";
//const url = "mongodb://localhost:27017/project";

import dotenv from "dotenv";
dotenv.config()
const url = String(process.env.URL);

mongoose.connect(url);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:")); //event Listener
db.once("open", function () {
  console.log("Connection Successful!");
});

export default db;
