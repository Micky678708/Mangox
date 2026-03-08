export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function toAbsoluteUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}