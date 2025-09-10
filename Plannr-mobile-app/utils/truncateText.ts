export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  return text.length > maxLength ? text.trim().slice(0, maxLength) + "..." : text.trim();
}
