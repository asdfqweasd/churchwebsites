/**
 * Extract image URL from Strapi v5 image data structure
 * Supports: populate=image, populate=*, and various Strapi versions
 */
export function getStrapiImageUrl(image: any): string | null {
  if (!image) return null;

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  // Strapi v5 structure with populate=image: image.data.attributes.url
  if (image.data?.attributes?.url) {
    const url = image.data.attributes.url;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }

  // Strapi v5 structure with populate=image (array): image.data[0].attributes.url
  if (Array.isArray(image.data) && image.data.length > 0) {
    const firstImage = image.data[0];
    if (firstImage.attributes?.url) {
      const url = firstImage.attributes.url;
      return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
    }
    if (firstImage.url) {
      const url = firstImage.url;
      return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
    }
  }

  // Direct URL (legacy or simplified structure)
  if (image.url) {
    const url = image.url;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }

  // Formats structure (Strapi v4 style)
  if (image.formats?.large?.url) {
    const url = image.formats.large.url;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }

  // Direct data object with url
  if (image.data && typeof image.data === 'object' && 'url' in image.data) {
    const url = (image.data as any).url;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }

  return null;
}

