import Reel from "../models/Reel.js";
import Comment from "../models/Comment.js";
import path from "path";
import { convertToBrowserMp4 } from "../utils/videoConverter.js";
export async function getReels(req, res) {
  try {
    // newest first
    const reels = await Reel.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, message: "OK", data: reels });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message, data: [] });
  }
}

export async function getReelById(req, res) {
  try {
    const reel = await Reel.findById(req.params.id).lean();
    if (!reel) return res.status(404).json({ success: false, message: "Reel not found" });

    return res.json({ success: true, message: "OK", data: reel });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message, data: {} });
  }
}

// Toggle Like
export async function likeReel(req, res) {
  try {
    const reelId = req.params.id;
    const userId = req.user?._id?.toString();

    const reel = await Reel.findById(reelId);
    if (!reel) return res.status(404).json({ success: false, message: "Reel not found" });

    // safe defaults
    if (!Array.isArray(reel.likes)) reel.likes = [];

    const idx = reel.likes.map(String).indexOf(String(userId));
    let isLiked = false;

    if (idx === -1) {
      reel.likes.push(userId);
      isLiked = true;
    } else {
      reel.likes.splice(idx, 1);
      isLiked = false;
    }

    await reel.save();

    return res.json({
      success: true,
      message: isLiked ? "Liked" : "Unliked",
      data: { isLiked, likesCount: reel.likes.length },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message, data: {} });
  }
}

// Add comment (simple + stable, no risky populate)
export const commentReel = async (req, res) => {
  try {
    const { text } = req.body;
    const reelId = req.params.id;

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: "Text required" });
    }

    const comment = await Comment.create({
      user: req.user._id,
      post: reelId,          // ✅ required
      text: text.trim(),
    });

    return res.status(201).json({ success: true, data: comment });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
// Save reel (toggle)
export async function saveReel(req, res) {
  try {
    const reelId = req.params.id;
    const userId = req.user?._id?.toString();

    const reel = await Reel.findById(reelId);
    if (!reel) return res.status(404).json({ success: false, message: "Reel not found", data: {} });

    // safe defaults (field name: savedBy)
    if (!Array.isArray(reel.savedBy)) reel.savedBy = [];

    const idx = reel.savedBy.map(String).indexOf(String(userId));
    let isSaved = false;

    if (idx === -1) {
      reel.savedBy.push(userId);
      isSaved = true;
    } else {
      reel.savedBy.splice(idx, 1);
      isSaved = false;
    }

    await reel.save();

    return res.json({
      success: true,
      message: isSaved ? "Saved" : "Unsaved",
      data: { isSaved, savedCount: reel.savedBy.length },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message, data: {} });
  }
}

export async function unsaveReel(req, res) {
  // if you want dedicated unsave endpoint
  try {
    const reelId = req.params.id;
    const userId = req.user?._id?.toString();

    const reel = await Reel.findById(reelId);
    if (!reel) return res.status(404).json({ success: false, message: "Reel not found", data: {} });

    if (!Array.isArray(reel.savedBy)) reel.savedBy = [];

    reel.savedBy = reel.savedBy.filter((id) => String(id) !== String(userId));
    await reel.save();

    return res.json({
      success: true,
      message: "Unsaved",
      data: { isSaved: false, savedCount: reel.savedBy.length },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message, data: {} });
  }
}
export const uploadReel = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video file required",
      });
    }

    const caption = req.body.caption || "";

    // uploaded raw file path
    const rawPath = req.file.path;

    // ffmpeg convert
    const convertedPath = await convertToBrowserMp4(rawPath);

    // final filename
    const finalFileName = path.basename(convertedPath);

    const reel = await Reel.create({
      user: req.user._id,
      caption,
      videoUrl: `/uploads/reels/${finalFileName}`,
      thumbnailUrl: "",
      likes: [],
      saves: [],
    });

    return res.status(201).json({
      success: true,
      message: "Reel uploaded",
      data: reel,
    });
  } catch (e) {
    console.error("uploadReel error:", e);
    return res.status(500).json({
      success: false,
      message: e.message || "Upload failed",
    });
  }
};