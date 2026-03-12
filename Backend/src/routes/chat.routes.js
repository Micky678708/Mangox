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
router.post("/message", protect, async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    const msg = new Message({
      conversationId,
      sender: req.user.id,
      text,
    });

    const saved = await msg.save();

    res.json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});
export default router;