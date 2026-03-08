import mongoose from "mongoose";

const ReelSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },
    caption: { type: String, default: "" },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true }
);

export default mongoose.model("Reel", ReelSchema);