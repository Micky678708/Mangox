import express from "express";
import protect from "../middleware/auth.middleware.js";
import { homeFeed } from "../controllers/home.controller.js";

const router = express.Router();

router.get("/feed", protect, homeFeed);

export default router;