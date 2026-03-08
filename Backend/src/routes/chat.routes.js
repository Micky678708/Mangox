import express from "express";
import protect from "../middleware/auth.middleware.js";
import chatUpload from "../config/chatMulter.js";
import {
  getChats,
  getChatById,
  sendMessage,
  sendMediaMessage,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/", protect, getChats);
router.get("/:id", protect, getChatById);
router.post("/:id/message", protect, sendMessage);
router.post("/:id/media", protect, chatUpload.single("media"), sendMediaMessage);

export default router;