export const STORE_ID = 'genztech019-21';

/**
 * Universal Redirection Helper
 * Handles short links (link.amazon, amzn.to, amzn.in), full amazon links, or raw ASINs.
 * Ensures the affiliate tag 'genztech019-21' is always applied.
 */
export function getUniversalRedirectUrl(product?: {
  affiliateUrl?: string;
  url?: string;
  asin?: string;
} | null): string {
  if (!product) {
    return `https://www.amazon.in/?tag=${STORE_ID}`;
  }

  const rawUrl = (product.affiliateUrl || product.url || '').trim();

  // 1. If it's an official Amazon short link (link.amazon, amzn.to, amzn.in)
  // Amazon already has the affiliate tracking and store ID baked into the short code.
  if (
    rawUrl &&
    (rawUrl.includes('link.amazon') ||
      rawUrl.includes('amzn.to') ||
      rawUrl.includes('amzn.in'))
  ) {
    return rawUrl;
  }

  // 2. If it's a full Amazon URL, ensure tag=genztech019-21 is enforced
  if (rawUrl && rawUrl.includes('amazon.')) {
    try {
      const parsed = new URL(rawUrl);
      parsed.searchParams.set('tag', STORE_ID);
      return parsed.toString();
    } catch {
      if (rawUrl.includes('tag=')) {
        return rawUrl.replace(/tag=[^&]+/g, `tag=${STORE_ID}`);
      }
      return rawUrl.includes('?')
        ? `${rawUrl}&tag=${STORE_ID}`
        : `${rawUrl}?tag=${STORE_ID}`;
    }
  }

  // 3. Fallback to ASIN
  if (product.asin) {
    return `https://www.amazon.in/dp/${product.asin}?tag=${STORE_ID}`;
  }

  // 4. Fallback to Amazon India store home
  return `https://www.amazon.in/?tag=${STORE_ID}`;
}
