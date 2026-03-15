import express from "express"
import protect from "../middleware/auth.middleware.js"

import {
getReels,
getReelById,
likeReel,
commentReel,
saveReel,
unsaveReel,
uploadReel
} from "../controllers/reels.controller.js"

import { uploadReelVideo } from "../config/multer.js"

const router = express.Router()

router.get("/", protect, getReels)
router.get("/:id", protect, getReelById)

router.post("/:id/like", protect, likeReel)
router.post("/:id/comment", protect, commentReel)

router.post("/:id/save", protect, saveReel)
router.post("/:id/unsave", protect, unsaveReel)

router.post(
"/upload",
protect,
uploadReelVideo.single("video"),
uploadReel
)

export default router