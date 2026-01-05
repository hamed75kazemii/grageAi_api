import express from "express";
import { auth } from "../middlewares/auth.js";
import { diagnoseCar } from "../controllers/diagnose_controller.js";
const router = express.Router();

router.use(auth);
router.get("/", diagnoseCar);

export default router;
