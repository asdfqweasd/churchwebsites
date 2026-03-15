// lib/strapiClient.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const RETRYABLE_STATUS_CODES = new Set([502, 503, 504]);
const DEFAULT_RETRY_DELAYS_MS = [3000, 8000, 15000];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildColdStartError(url: string, attempts: number) {
  return new Error(
    `Strapi is waking up after a cold start. Retried ${attempts} time${attempts === 1 ? "" : "s"} but ${url} is still unavailable. Please wait a moment and refresh.`
  );
}

export async function fetchFromStrapi(path: string) {
  const url = `${STRAPI_URL}${path}`;

  for (let attempt = 0; attempt <= DEFAULT_RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 300 },
      });

      if (res.ok) {
        return await res.json();
      }

      if (!RETRYABLE_STATUS_CODES.has(res.status)) {
        throw new Error(`Failed to fetch ${url}: ${res.status}`);
      }

      if (attempt === DEFAULT_RETRY_DELAYS_MS.length) {
        throw buildColdStartError(url, attempt);
      }
    } catch (error) {
      if (attempt === DEFAULT_RETRY_DELAYS_MS.length) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error(`Failed to fetch ${url}`);
      }
    }

    await sleep(DEFAULT_RETRY_DELAYS_MS[attempt]);
  }

  throw buildColdStartError(url, DEFAULT_RETRY_DELAYS_MS.length);
}
