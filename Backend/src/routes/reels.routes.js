import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  getReels,
  likeReel,
  saveReel,
  unsaveReel,
  uploadReel, // controller
} from "../controllers/reels.controller.js";

import { uploadReelVideo } from "../config/multer.js";

const router = express.Router();

router.get("/", protect, getReels);
router.get("/:id", protect, getReelById);

router.post("/:id/like", protect, likeReel);
router.post("/:id/comment", protect, commentReel);
router.post("/:id/save", protect, saveReel);
router.post("/:id/unsave", protect, unsaveReel);

// ✅ UPLOAD (field name must be "video")
router.post("/upload", protect, uploadReelVideo.single("video"), uploadReel);
router.get("/search",async(req,res)=>{

const q = req.query.q

const users = await User.find({
username:{
$regex:q,
$options:"i"
}
}).limit(10)

res.json(users)

})
export default router;