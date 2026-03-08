import Reel from "../models/Reel.js";

// ✅ named export: homeFeed
export const homeFeed = async (req, res) => {
  try {
    const me = req.user?._id; // protect middleware se req.user aata hai

    const reels = await Reel.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("user", "username name");

    const data = reels.map((r) => ({
      _id: r._id,
      caption: r.caption || "",
      videoUrl: r.videoUrl || r.videoURL || r.video || r.url, // fallback
      thumbUrl: r.thumbUrl || r.thumbnail || "",
      user: r.user,
      likesCount: Array.isArray(r.likes) ? r.likes.length : 0,
      commentsCount: Array.isArray(r.comments) ? r.comments.length : (r.commentsCount || 0),
      isLiked: me ? (r.likes || []).some((id) => String(id) === String(me)) : false,
      isSaved: me ? (r.saves || []).some((id) => String(id) === String(me)) : false,
      createdAt: r.createdAt,
    }));

    return res.json({ success: true, message: "OK", data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message, data: {} });
  }
};
export async function getMiniReels(req, res) {
  try {
    const reels = await Reel.find({})
      .sort({ createdAt: -1 })
      .limit(12)
      .select("thumbUrl videoUrl user caption createdAt")
      .populate("user", "username name");

    return res.json({ success: true, message: "OK", data: reels });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

export async function getSuggestions(req, res) {
  try {
    const me = req.userId;

    const myUser = await User.findById(me).select("following");
    const followingIds = new Set((myUser?.following || []).map(String));
    followingIds.add(String(me));

    const users = await User.find({})
      .select("username name")
      .limit(30);

    // filter: jo me follow nahi karta
    const suggestions = users
      .filter((u) => !followingIds.has(String(u._id)))
      .slice(0, 8);

    return res.json({ success: true, message: "OK", data: suggestions });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// abhi story model nahi hai to mock de rahe
export async function getStoriesMock(req, res) {
  const demo = [
    { _id: "s1", username: "mango", ring: true },
    { _id: "s2", username: "demo_user", ring: true },
    { _id: "s3", username: "rajput", ring: false },
  ];
  return res.json({ success: true, message: "OK", data: demo });
}