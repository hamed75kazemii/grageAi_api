import express from "express";
const router = express.Router();
import { insertCar } from "../controllers/car_controller.js";
import auth from "../middlewares/auth.js";

router.use(auth);
router.post("/add", insertCar);

export default router;
