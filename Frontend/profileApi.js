export * from "./api/profile.js";
export const followUser = (id) =>
  axios.post(`/profile/follow/${id}`);

export const unfollowUser = (id) =>
  axios.post(`/profile/unfollow/${id}`);