function slugify(input: string): string {
  return input
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 4);
}

function randomToken(len = 4): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i += 1) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}

export function generateSku(name: string): string {
  const prefix = slugify(name) || "PRD";
  return `${prefix}-${randomToken(4)}`;
}
