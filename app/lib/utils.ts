import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a size in bytes into a human-readable string (Bytes, KB, MB, GB, TB).
 *
 * @param bytes - Size in bytes
 * @param decimals - Number of decimal places to include (default: 2)
 * @returns Human-readable string representation of the size
 */
export function formatSize(bytes: number, decimals: number = 2): string {
  if (!bytes || bytes <= 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  let i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    sizes.length - 1
  );

  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  if (value >= k && i < sizes.length - 1) {
    i++;
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  return `${value} ${sizes[i]}`;
}

export const generateUuid = (): string => crypto.randomUUID()