import multer from "multer";
import path from "path";
import fs from "fs";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const reelsDir = path.join(process.cwd(), "uploads", "reels");
ensureDir(reelsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, reelsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = ext || ".mp4";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const fileFilter = (req, file, cb) => {
  // ✅ Accept by mimetype
  if (file?.mimetype?.startsWith("video/")) return cb(null, true);

  // ✅ Backup: accept by extension (kabhi-kabhi Thunder/clients mimetype nahi bhejte)
  const ext = path.extname(file.originalname || "").toLowerCase();
  const allowedExt = [".mp4", ".mov", ".mkv", ".webm"];
  if (allowedExt.includes(ext)) return cb(null, true);

  return cb(new Error("Only video files allowed"), false);
};

export const uploadReelVideo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
});