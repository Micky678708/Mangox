import { Router } from "express";
import {
  signup,
  login,
  refresh,
  logout,
  requestOtp,
  verifyOtp,
  resetPasswordOtp,
  findId,
} from "../controllers/auth.controller.js";

const router = Router();

// auth
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// otp flow
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password-otp", resetPasswordOtp);

// find id
router.get("/find-id", findId);

export default router;