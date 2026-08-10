export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "Arowa Studio";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export const BUSINESS_PHONE_DISPLAY = "+971557519880";
export const BUSINESS_PHONE_E164 = "+971504331603";

export const BUSINESS_ADDRESS = {
  street: "Dragon Mart - Al Awir Road",
  locality: "Warsan First, Dubai International City",
  region: "Dubai",
  country: "AE",
};