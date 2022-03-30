import express from "express";
import dbConnection from "./connection/dbConnection";
import user from "./model/user";
import router from "./routes/routes";

import dotenv from "dotenv";
dotenv.config()

const port = process.env.PORT;
//console.log(port);

const app = express();
app.use(express.json());
app.use(router);
dbConnection;

app.listen(port, () => {
  console.log(`Server is on the port ${port}`);
});
