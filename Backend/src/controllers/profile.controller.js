// src/controllers/profile.controller.js
import User from "../models/User.js";
import { ok, fail } from "../utils/apiResponse.js";

function pickUser(u) {
  return {
    id: u._id,
    username: u.username,
    name: u.name,
    email: u.email,
    phone: u.phone,
    followersCount: u.followers?.length || 0,
    followingCount: u.following?.length || 0,
  };
}

// ✅ GET /api/profile/:id
export async function getProfile(req, res) {
  try {
    const me = req.userId;
    const id = req.params.id;

    const user = await User.findById(id).select("-password -refreshToken");
    if (!user) return fail(res, "User not found", 404);

    const isFollowing = user.followers?.some((x) => String(x) === String(me)) || false;

    return ok(res, "OK", { user: pickUser(user), isFollowing });
  } catch (e) {
    return fail(res, e?.message || "Get profile failed", 500);
  }
}

// ✅ GET /api/profile/find?query=...
export async function findProfile(req, res) {
  try {
    const q = String(req.query.query || "").trim();
    if (!q) return fail(res, "query required", 400);

    const query = q.includes("@") ? q.toLowerCase() : q;

    const user = await User.findOne({
      $or: [{ email: query }, { phone: q }, { username: q }],
    }).select("-password -refreshToken");

    if (!user) return fail(res, "User not found", 404);
    return ok(res, "OK", { user: pickUser(user) });
  } catch (e) {
    return fail(res, e?.message || "Find profile failed", 500);
  }
}

// ✅ POST /api/profile/follow/:id
export async function followUser(req, res) {
  try {
    const me = req.userId;
    const targetId = req.params.id;

    if (!targetId) return fail(res, "target id missing", 400);
    if (String(me) === String(targetId)) return fail(res, "You can't follow yourself", 400);

    const [myUser, targetUser] = await Promise.all([
      User.findById(me),
      User.findById(targetId),
    ]);

    if (!myUser) return fail(res, "Me not found", 404);
    if (!targetUser) return fail(res, "User not found", 404);

    const already = (myUser.following || []).some((x) => String(x) === String(targetId));
    if (already) return ok(res, "Already following", { isFollowing: true });

    myUser.following = myUser.following || [];
    targetUser.followers = targetUser.followers || [];

    myUser.following.push(targetUser._id);
    targetUser.followers.push(myUser._id);

    await Promise.all([myUser.save(), targetUser.save()]);

    return ok(res, "Followed", { isFollowing: true });
  } catch (e) {
    return fail(res, e?.message || "Follow failed", 500);
  }
}

// ✅ POST /api/profile/unfollow/:id
export async function unfollowUser(req, res) {
  try {
    const me = req.userId;
    const targetId = req.params.id;

    if (!targetId) return fail(res, "target id missing", 400);

    const [myUser, targetUser] = await Promise.all([
      User.findById(me),
      User.findById(targetId),
    ]);

    if (!myUser) return fail(res, "Me not found", 404);
    if (!targetUser) return fail(res, "User not found", 404);

    myUser.following = (myUser.following || []).filter((x) => String(x) !== String(targetId));
    targetUser.followers = (targetUser.followers || []).filter((x) => String(x) !== String(me));

    await Promise.all([myUser.save(), targetUser.save()]);

    return ok(res, "Unfollowed", { isFollowing: false });
  } catch (e) {
    return fail(res, e?.message || "Unfollow failed", 500);
  }
}