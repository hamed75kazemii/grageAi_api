import express from "express";
const router = express.Router();
import { tipsController } from "../controllers/tips_controller.js";

router.get("/", tipsController);

export default router;
