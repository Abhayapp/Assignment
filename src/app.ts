import express from "express";
import conn from "./connection/conn";
import user from "./model/user";
import router from "./routes/routes";

const mosca = require("mosca");
      const setting = {
        port: 1883,
      };

const app = express();
app.use(express.json());
conn;
user;
app.use(router);


app.listen(8080, () => {
  console.log("Server is on the port 8080");
});
//
