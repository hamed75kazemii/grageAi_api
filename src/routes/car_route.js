import express from "express";
const router = express.Router();
import { insertCar, removeCar } from "../controllers/car_controller.js";
import { auth } from "../middlewares/auth.js";

router.use(auth);
router.post("/add", insertCar);
router.delete("/remove", removeCar);

export default router;
