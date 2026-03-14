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
import User from "../models/User.js";

const router = Router();

// auth
router.post("/signup", async (req, res) => {

  try {

    const {
      phone,
      email,
      password,
      day,
      month,
      year,
      username,
      name
    } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const user = new User({
      phone,
      email,
      password,
      username,
      name,
      dob: {
        day,
        month,
        year
      }
    });

    await user.save();

    res.json({
      success: true,
      user
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Signup failed"
    });

  }

});
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// otp flow
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password-otp", resetPasswordOtp);

// find id
router.get("/find-id", findId);
router.get("/check-username/:username", async (req, res) => {
  try {

    const { username } = req.params;

    const existing = await User.findOne({ username });

    if (existing) {
      return res.json({ available: false });
    }

    res.json({ available: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;