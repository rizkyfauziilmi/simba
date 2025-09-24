export function getAvatarFallback(name: string): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  let initials = "";
  for (let i = 0; i < words.length && initials.length < 2; i++) {
    if (words[i][0]) {
      initials += words[i][0].toUpperCase();
    }
  }
  return initials;
}
