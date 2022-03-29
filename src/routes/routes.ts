import express from "express";
import controller from "../controller/controller";
const router = express.Router();
const app = express();

router.post("/signup", controller.signup);

router.post("/login", controller.login);

router.get("/authuser", controller.authuser);

router.post("/update", controller.update);

router.post("/getprofile", controller.getprofile);

router.delete("/delete", controller.del);

router.post("/deactive", controller.deactivate);

router.post("/reactive", controller.reactive);

router.post("/mqserver", controller.mqserver);

export default router;
