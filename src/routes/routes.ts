import express from "express";
import controller from "../controller/controller";
const router = express.Router();
const app = express();

router.post("/signup", controller.signUp);

router.post("/login", controller.login);

router.get("/authuser", controller.authUser);

router.post("/update", controller.update);

router.post("/getprofile", controller.getProfile);

router.delete("/delete", controller.del);

router.post("/deactive", controller.deActivate);

router.post("/reactive", controller.reActivate);

export default router;
