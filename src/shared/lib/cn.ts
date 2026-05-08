import { twMerge } from "tailwind-merge";

export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[]
  | { [key: string]: unknown };

function flatten(input: ClassValue): string {
  if (!input && input !== 0) {
    return "";
  }
  if (typeof input === "string" || typeof input === "number") {
    return String(input);
  }
  if (Array.isArray(input)) {
    return input.map(flatten).filter(Boolean).join(" ");
  }
  if (typeof input === "object") {
    const keys: string[] = [];
    for (const key in input) {
      if (input[key]) {
        keys.push(key);
      }
    }
    return keys.join(" ");
  }
  return "";
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(inputs.map(flatten).filter(Boolean).join(" "));
}
