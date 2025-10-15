import { format } from "date-fns";
import { id } from "date-fns/locale";

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

export function enumToReadable(enumValue: string): string {
  if (!enumValue) return "";

  // Split by underscore and convert each word
  const words = enumValue.split("_");

  return words
    .map((word) => {
      // Convert to lowercase first, then capitalize first letter
      const lowerWord = word.toLowerCase();
      return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
    })
    .join(" ");
}

export function formattedNip(nip: string): string {
  return nip.replace(/(\d{4})(\d{2})(\d{2})(\d{4})(\d{4})/, "$1-$2-$3-$4-$5");
}

export function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}
