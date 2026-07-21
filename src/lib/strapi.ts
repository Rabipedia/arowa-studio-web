

const STRAPI_URL = 
  process.env.STRAPI_URL ?? 
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "http://localhost:1337";

export async function fetchStrapi<T>(
  path: string,
  query?: Record<string, string>,
): Promise<T> {
  const url = new URL(`/api${path}`, STRAPI_URL);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }
  }
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `Strapi request failed: ${res.status} ${res.statusText} - ${url.pathname}`,
    );
  }
  return res.json();
}


export function mediaUrl(path: string): string {
  if(path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"}${path}`;
}

export async function postStrapi<T>(path: string, body: unknown): Promise<T> {
  const url = new URL(`/api${path}`, STRAPI_URL);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(body),
  });
  if(!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error?.message ?? `Request failed: ${res.status}`);
  }
  return res.json();
}
