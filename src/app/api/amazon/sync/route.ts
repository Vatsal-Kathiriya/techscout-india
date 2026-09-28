import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { STORE_ID } from '@/lib/affiliate';
import { isRequestAuthorized } from '@/lib/auth';

/**
 * Follow shortlink redirects (e.g. amzn.in, amzn.to) using native fetch
 * checking the Location header to quickly resolve to the final Amazon product URL.
 */
async function resolveShortlink(shortUrl: string): Promise<string> {
  let currentUrl = shortUrl;
  for (let hop = 0; hop < 5; hop++) {
    try {
      const res = await fetch(currentUrl, {
        method: 'HEAD',
        redirect: 'manual',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      const location = res.headers.get('location');
      if (!location) {
        if (res.status === 200 && res.url) currentUrl = res.url;
        break;
      }

      currentUrl = location.startsWith('http')
        ? location
        : new URL(location, currentUrl).toString();

      // Check if we hit an ASIN in the URL
      if (
        currentUrl.match(/\/dp\/([A-Z0-9]{10})/i) ||
        currentUrl.match(/\/gp\/product\/([A-Z0-9]{10})/i) ||
        currentUrl.match(/\/gp\/aw\/d\/([A-Z0-9]{10})/i) ||
        currentUrl.match(/\b(B0[A-Z0-9]{8})\b/i)
      ) {
        return currentUrl;
      }
    } catch {
      break;
    }
  }

  // Fallback: full GET redirect follow
  try {
    const getRes = await fetch(currentUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
    });
    if (getRes.url) return getRes.url;
  } catch {}

  return currentUrl;
}

export async function POST(req: Request) {
  if (!isRequestAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized: Owner access required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    let rawInput = (body.input || body.url || body.asin || '').trim();

    if (!rawInput) {
      return NextResponse.json(
        { error: 'Please enter an Amazon.in URL, short link, or 10-digit ASIN.' },
        { status: 400 }
      );
    }

    // 1. Extract URL if user pasted mobile share text containing a link
    const urlMatch = rawInput.match(/(https?:\/\/[^\s\)\>]+)/i);
    let targetUrl = urlMatch ? urlMatch[1] : (rawInput.startsWith('http') ? rawInput : '');

    let extractedAsin = '';

    // 2. First check if a 10-digit ASIN is already visible in the raw text or URL
    const explicitAsinMatch =
      rawInput.match(/\/dp\/([A-Z0-9]{10})/i) ||
      rawInput.match(/\/gp\/product\/([A-Z0-9]{10})/i) ||
      rawInput.match(/\/gp\/aw\/d\/([A-Z0-9]{10})/i) ||
      rawInput.match(/\/d\/([A-Z0-9]{10})/i) ||
      rawInput.match(/\b(B0[A-Z0-9]{8})\b/i) ||
      rawInput.match(/^([A-Z0-9]{10})$/i);

    if (explicitAsinMatch) {
      extractedAsin = explicitAsinMatch[1].toUpperCase();
    }

    // 3. If no direct ASIN was found, check for short links that need redirect resolution
    if (!extractedAsin && targetUrl) {
      if (targetUrl.includes('amzn.in') || targetUrl.includes('amzn.to')) {
        targetUrl = await resolveShortlink(targetUrl);
        const resolvedMatch =
          targetUrl.match(/\/dp\/([A-Z0-9]{10})/i) ||
          targetUrl.match(/\/gp\/product\/([A-Z0-9]{10})/i) ||
          targetUrl.match(/\/gp\/aw\/d\/([A-Z0-9]{10})/i) ||
          targetUrl.match(/\/d\/([A-Z0-9]{10})/i) ||
          targetUrl.match(/\b(B0[A-Z0-9]{8})\b/i);
        if (resolvedMatch) {
          extractedAsin = resolvedMatch[1].toUpperCase();
        }
      }
    }

    // 4. Validate ASIN: catch common user typo (e.g. 9-character ASIN like B0gpHrVNJ)
    if (!extractedAsin) {
      const partialAsinMatch = rawInput.match(/\b(B0[A-Z0-9]{7})\b/i);
      if (partialAsinMatch) {
        return NextResponse.json(
          {
            error: `"${partialAsinMatch[1]}" has only 9 characters. Amazon ASINs must be exactly 10 alphanumeric characters (e.g. B082LSVT4B). Please verify the 10th character or copy the full Amazon product link.`,
          },
          { status: 400 }
        );
      }

      if (rawInput.includes('link.amazon')) {
        return NextResponse.json(
          {
            error: `Invalid domain "link.amazon". Please paste a valid link from amazon.in, amzn.in, or amzn.to, or paste the 10-digit ASIN directly (e.g. B082LSVT4B).`,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: `Could not detect a valid Amazon ASIN or product link from "${rawInput}". Please paste an Amazon.in URL, amzn.in short link, or 10-digit ASIN (e.g. B082LSVT4B).`,
        },
        { status: 400 }
      );
    }

    // 5. Multi-tier scraping: Desktop Tier 1 -> Mobile Tier 2
    let html = '';
    let fetchStatus = 200;

    // Tier 1: Desktop Amazon Product Page
    const desktopUrl = `https://www.amazon.in/dp/${extractedAsin}`;
    try {
      const desktopRes = await axios.get(desktopUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          Connection: 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
        },
        timeout: 9000,
      });
      html = desktopRes.data;
      fetchStatus = desktopRes.status;
    } catch (desktopErr: any) {
      fetchStatus = desktopErr.response?.status || 500;
    }

    let $ = cheerio.load(html || '');
    let title = $('#productTitle').text().trim();

    // Tier 2: Mobile failover if desktop returned no title or was challenged
    if (!title) {
      const mobileUrl = `https://www.amazon.in/gp/aw/d/${extractedAsin}`;
      try {
        const mobileRes = await axios.get(mobileUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            Connection: 'keep-alive',
          },
          timeout: 9000,
        });
        $ = cheerio.load(mobileRes.data);
        title =
          $('#title').text().trim() ||
          $('#productTitle').text().trim() ||
          $('h1').first().text().trim();
      } catch (mobileErr: any) {
        if (!fetchStatus || fetchStatus === 200) {
          fetchStatus = mobileErr.response?.status || 500;
        }
      }
    }

    if (!title) {
      if (fetchStatus === 404) {
        return NextResponse.json(
          {
            error: `Product not found on Amazon.in (ASIN: ${extractedAsin}). Please verify that this item exists on Amazon India.`,
          },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          error: `Amazon anti-bot challenged automated fetch for ASIN "${extractedAsin}". Please verify the ASIN or use the "Add Custom Hardware" manual form.`,
        },
        { status: 503 }
      );
    }

    // Extract Price
    let price = $('.a-price-whole').first().text().trim();
    if (!price) price = $('#priceblock_ourprice').text().trim();
    if (!price) price = $('#priceblock_dealprice').text().trim();
    if (!price) {
      const offscreen = $(
        '.apexPriceToPay span.a-offscreen, span.a-price span.a-offscreen, #corePrice_desktop .a-price .a-offscreen'
      )
        .first()
        .text()
        .trim();
      if (offscreen) price = offscreen.replace(/[^\d.,]/g, '');
    }
    price = price.replace(/\.$/, '').replace(/[^\d.,]/g, '');

    // Extract MRP (Original Basis / Strike-through Price)
    let mrp = '';
    const mrpSelectors = [
      'span.basisPrice span.a-offscreen',
      '.a-price.a-text-price span.a-offscreen',
      'span[data-a-strike="true"] span.a-offscreen',
      '.a-text-strike',
      '#listPrice',
      '#priceblock_ourprice',
    ];
    for (const sel of mrpSelectors) {
      let val = $(sel).first().text().trim();
      if (val) {
        val = val.replace(/[^\d.,]/g, '').replace(/\.00$/, '').trim();
        if (val) {
          mrp = val.startsWith('₹') ? val : `₹${val}`;
          break;
        }
      }
    }

    // Extract Image
    let imageUrl =
      $('#landingImage').attr('src') ||
      $('#main-image').attr('src') ||
      $('#landingImage').attr('data-old-hires');

    if (!imageUrl) {
      const dynamicImageStr = $('#landingImage').attr('data-a-dynamic-image');
      if (dynamicImageStr) {
        try {
          const dynamicImages = JSON.parse(dynamicImageStr);
          imageUrl = Object.keys(dynamicImages)[0];
        } catch {}
      }
    }

    // Extract Ratings & Reviews
    let ratingStr =
      $('#acrPopover').attr('title') ||
      $('.a-icon-star .a-icon-alt').first().text() ||
      $('.a-star-rating-mobile .a-icon-alt').first().text();
    let rating = '4.5';
    if (ratingStr && ratingStr.match(/(\d\.\d)/)) {
      rating = ratingStr.match(/(\d\.\d)/)![1];
    }

    let reviewStr = $('#acrCustomerReviewText').first().text().trim();
    let reviews = '1,420';
    if (reviewStr) {
      reviews = reviewStr.split(' ')[0];
    }

    // Extract Brand: first check byline, then fallback to first word of title
    let brand = '';
    const byline = $('#bylineInfo').text().trim() || $('#bylineInfo_feature_div').text().trim();
    const bylineMatch = byline.match(/(?:Visit the |Brand:\s*)([\w\d\s]+?)(?: Store|$)/i);
    if (bylineMatch && bylineMatch[1]) {
      brand = bylineMatch[1].trim();
    }
    if (!brand || brand.toLowerCase() === 'genztech') {
      const firstWord = (title.trim().split(/\s+/)[0] || '').replace(/[®™:,.-]+$/g, '').trim();
      brand = firstWord || 'Generic';
    }

    // Clean price calculations
    const cleanPrice = price ? (price.startsWith('₹') ? price : `₹${price}`) : 'Price not available';
    const numPrice = parseFloat((price || '').replace(/[^0-9.]/g, '')) || 0;
    const numMrp = parseFloat((mrp || '').replace(/[^0-9.]/g, '')) || 0;
    const finalMrp = numMrp > numPrice ? mrp : cleanPrice;

    // Affiliate URL construction:
    // If user provided a short link (amzn.to, amzn.in), keep it intact!
    // Otherwise construct universal affiliate URL with STORE_ID.
    let finalAffiliateUrl =
      targetUrl && (targetUrl.includes('amzn.to') || targetUrl.includes('amzn.in'))
        ? targetUrl
        : `https://www.amazon.in/dp/${extractedAsin}?tag=${STORE_ID}`;

    return NextResponse.json({
      asin: extractedAsin,
      title,
      brand,
      price: cleanPrice,
      mrp: finalMrp,
      imageUrl: imageUrl || '',
      url: `https://www.amazon.in/dp/${extractedAsin}`,
      affiliateUrl: finalAffiliateUrl,
      rating,
      reviews,
    });
  } catch (error: any) {
    console.error('Amazon Sync Error:', error.message);
    return NextResponse.json(
      {
        error:
          error.message ||
          'Failed to fetch data from Amazon. Please check the link or use the Manual Creator.',
      },
      { status: 500 }
    );
  }
}
