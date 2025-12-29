// lib/strapiClient.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchFromStrapi(path: string) {
  const url = `${STRAPI_URL}${path}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }

  const data = await res.json();
  return data;
}
