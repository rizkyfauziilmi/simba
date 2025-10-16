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

export function generateKodeMatpel(nama: string): string {
  const inisial = nama
    .split(" ")
    .map((kata) => kata[0].toUpperCase())
    .join("")
    .slice(0, 2);

  const waktu = Date.now();
  const random = Math.floor(Math.random() * 10);
  const uniqueNumber = ((waktu % 1000) + random).toString().padStart(3, "0");

  return `${inisial}${uniqueNumber}`;
}
