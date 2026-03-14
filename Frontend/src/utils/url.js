export const API_BASE = import.meta.env.VITE_API_URL || "https://mangox-jhei.onrender.com";

export function toAbsoluteUrl(path) {
  if (!path) return "";
  if (path.startsWith("https")) return path;
  return `${API_BASE}${path}`;
}