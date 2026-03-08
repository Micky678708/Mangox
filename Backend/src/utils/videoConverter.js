import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";

export function convertToBrowserMp4(inputPath) {
  return new Promise((resolve, reject) => {
    const ext = path.extname(inputPath);
    const outputPath = inputPath.replace(ext, "_converted.mp4");

    const args = [
      "-y",
      "-i", inputPath,
      "-c:v", "libx264",
      "-c:a", "aac",
      "-movflags", "+faststart",
      "-preset", "fast",
      "-crf", "23",
      outputPath,
    ];

    const ff = spawn("ffmpeg", args, { windowsHide: true });

    let stderr = "";
    ff.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    ff.on("error", (err) => {
      reject(err);
    });

    ff.on("close", async (code) => {
      if (code !== 0) {
        return reject(new Error(stderr || `ffmpeg failed with code ${code}`));
      }

      try {
        await fs.unlink(inputPath); // old raw file delete
      } catch {}

      resolve(outputPath);
    });
  });
}