// utils/limitText.js
export function limitText(text, limit = 40) {
  if (!text) return "";
  if (text.length <= limit) return text;
  return text.slice(0, limit) + "...";
}
