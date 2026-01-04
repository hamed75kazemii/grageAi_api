import express from "express";
const router = express.Router();
import {
  login,
  register,
  verifyEmail,
} from "../controllers/auth_controller.js";

router.post("/login", login);
router.post("/register", register);
router.post("/verify-email", verifyEmail);

export default router;
