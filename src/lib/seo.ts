export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "Arowa Studio";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}