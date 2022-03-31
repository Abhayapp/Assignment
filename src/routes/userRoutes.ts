import express from "express";
import controller from "../controller/userController";
const router = express.Router();
const app = express();

/**
 * @swagger
 * components:
 *      schema:
 *          User:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                  password:
 *                      type: string
 *                  firstName:
 *                      type: string
 *                  lastName:
 *                      type: string
 *                  email:
 *                      type: string
 *                  phoneNumber:
 *                      type: integer
 *                  status:
 *                      type: integer
 */

/**
 * @swagger
 * /signup:
 *  post:
 *      summary: Used to insert data
 *      description: This api is for data insertion
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/User'
 *      responses:
 *          200:
 *              description: signed up successfully
 *
 */

router.post("/signup", controller.signUp);

router.post("/login", controller.login);

router.get("/authuser", controller.authUser);

router.post("/update", controller.update);

router.post("/getprofile", controller.getProfile);

router.delete("/delete", controller.del);

router.post("/deactive", controller.deActivate);

router.post("/reactive", controller.reActivate);

export default router;
