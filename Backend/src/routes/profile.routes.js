// src/routes/profile.routes.js
import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import {
  getProfile,
  findProfile,
  followUser, 
  unfollowUser,
} from "../controllers/profile.controller.js";

const router = Router();

// ✅ profile
router.get("/find", protect, findProfile);
router.get("/:id", protect, getProfile);

// ✅ follow system
router.post("/follow/:id", protect, followUser);
router.post("/unfollow/:id", protect, unfollowUser);

export default router;