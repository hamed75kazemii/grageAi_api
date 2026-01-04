import express from "express";
const router = express.Router();
import { auth } from "../middlewares/auth.js";
import { tipsController } from "../controllers/tips_controller.js";

router.use(auth);
router.get("/", tipsController);

export default router;
