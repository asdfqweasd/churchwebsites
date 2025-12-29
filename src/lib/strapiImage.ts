/**
 * Extract image URL from Strapi v4/v5 image data structure.
 * Supports: populate=image, populate=*, and various Strapi versions.
 */
export type StrapiImageFile = {
  url?: string;
  formats?: {
    large?: { url?: string };
  };
};

export type StrapiImage =
  | StrapiImageFile
  | {
      data?:
        | StrapiImageFile
        | { attributes?: StrapiImageFile; url?: string }
        | Array<{ attributes?: StrapiImageFile; url?: string }>;
    };

export function getStrapiImageUrl(image: StrapiImage | null | undefined): string | null {
  if (!image) return null;

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  const normalize = (url?: string | null): string | null => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
  };

  // Strapi v5 structure with populate=image: image.data.attributes.url
  if ("data" in image && image.data && !Array.isArray(image.data)) {
    const dataEntry = image.data;
    if (typeof dataEntry === "object" && "attributes" in dataEntry) {
      const url = (dataEntry as { attributes?: StrapiImageFile })?.attributes?.url;
      const normalized = normalize(url);
      if (normalized) return normalized;
    }
    if (typeof dataEntry === "object" && "url" in dataEntry) {
      const url = (dataEntry as { url?: string }).url;
      const normalized = normalize(url);
      if (normalized) return normalized;
    }
  }

  // Strapi v5 structure with populate=image (array): image.data[0].attributes.url
  if ("data" in image && Array.isArray(image.data) && image.data.length > 0) {
    const firstImage = image.data[0];
    const url =
      firstImage?.attributes?.url ??
      firstImage?.url;
    const normalized = normalize(url);
    if (normalized) return normalized;
  }

  // Direct URL (legacy or simplified structure)
  if ("url" in image) {
    const url = (image as StrapiImageFile).url;
    const normalized = normalize(url);
    if (normalized) return normalized;
  }

  // Formats structure (Strapi v4 style)
  if ("formats" in image) {
    const url = (image as StrapiImageFile).formats?.large?.url;
    const normalized = normalize(url);
    if (normalized) return normalized;
  }

  return null;
}

