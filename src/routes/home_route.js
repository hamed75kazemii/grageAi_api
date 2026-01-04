import express from "express";
import { homeController } from "../controllers/home_controller.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();

router.use(auth);
router.get("/", homeController);

export default router;
