import express from "express";
import dbConnection from "./connection/dbConnection";
import userModel from "./model/user";
import router from "./routes/userRoutes";
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(router);
dbConnection;

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Swagger API Documentation",
      version: "6.1.0",
    },
    servers: [
      {
        url: "http://localhost:8000/",
      },
    ],
  },
  apis: ["./src/routes/userRoutes.ts"],
};
const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server is on the port ${port}`);
});
