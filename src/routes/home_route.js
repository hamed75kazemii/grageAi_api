import express from "express";
import { homeController } from "../controllers/home_controller.js";
const router = express.Router();

router.get("/", homeController);

export default router;
