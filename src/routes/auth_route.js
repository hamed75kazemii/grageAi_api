import express from "express";
const router = express.Router();
import {
  login,
  register,
  verifyEmail,
  forgetPassword,
  resetPassword,
} from "../controllers/auth_controller.js";

router.post("/login", login);
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);

export default router;
