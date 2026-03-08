import { Router } from "express";
import Reel from "../models/Reel.js";

const router = Router();

router.post("/seed-reels", async (req, res) => {
  try {
    const userId = req.body.userId || req.body.userid; // support both
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId required" });
    }
router.post("/seed-reels", async (req, res) => {
  return res.json({
    success: true,
    message: "seed route disabled",
  });
});
    return res.json({ success: true, message: "seeded", data: reels });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

export default router;