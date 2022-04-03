import express from "express";
import controller from "../controller/userController";
const router = express.Router();
import verifyjwtToken from "../middleware/jwtVerify";
import {
  userSignupValidator,
  userLoginValidator,
} from "../validator/userValidator";

/**
 * @swagger
 * components:
 *      schemas:
 *          signupModel:
 *              type: object
 *              required:
 *                  -username
 *                  -password
 *                  -firstName
 *                  -lastName
 *                  -email
 *                  -phoneNumber
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
 *                      $ref: '#components/schemas/signupModel'
 *      responses:
 *          200:
 *              description: signed up successfully
 *
 */

/**
 * @swagger
 * components:
 *      schemas:
 *          userLogin:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                  password:
 *                      type: string
 *
 */

/**
 * @swagger
 * /login:
 *  post:
 *      summary: Used to login data
 *      description: Login purpose
 *      requestBody:
 *         required: true
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#components/schemas/userLogin'
 *      responses:
 *          200:
 *              description: Action Done
 *
 */

/**
 * @swagger
 * /authuser:
 *  get:
 *      summary: Used to  verify user
 *      description: verify user
 *      responses:
 *          200:
 *              description: Action Done
 *
 */

/**
 * @swagger
 * /update:
 *  post:
 *      summary: Used to update user data
 *      description: user data updation purpose
 *      requestBody:
 *         required: true
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#components/schemas/signupModel'
 *      responses:
 *          200:
 *              description: Action Done
 *
 */

/**
 * @swagger
 * /getprofile:
 *  get:
 *      summary: Used to get user profile
 *      description: user profile
 *      responses:
 *          200:
 *              description: Action Done
 *
 */

/**
 * @swagger
 * /delete:
 *  delete:
 *      summary: Used to get delete profile
 *      description: delete user profile
 *      responses:
 *          200:
 *              description: Action Done
 *
 */

/**
 * @swagger
 * /deactive:
 *  post:
 *      summary: Used to get Deactivate profile
 *      description: Deactivate user profile
 *      responses:
 *          200:
 *              description: Action Done
 *
 */

/**
 * @swagger
 * /reactive:
 *  post:
 *      summary: Used to reactivate user
 *      description: user reactivate purpose
 *      requestBody:
 *         required: true
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#components/schemas/userLogin'
 *      responses:
 *          200:
 *              description: Action Done
 *
 */

router.post("/signup", userSignupValidator, controller.signUp);

router.post("/login", userLoginValidator, controller.login);

router.get("/authuser", verifyjwtToken, controller.authUser);

router.post("/update", verifyjwtToken, controller.update);

router.get("/getprofile", verifyjwtToken, controller.getProfile);

router.delete("/delete", verifyjwtToken, controller.del);

router.post("/deactive", verifyjwtToken, controller.deActivate);

router.post("/reactive", userLoginValidator, controller.reActivate);

router.post("/uploadimage",controller.uploadImage);

export default router;
