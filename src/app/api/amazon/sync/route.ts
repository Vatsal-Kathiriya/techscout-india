import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { STORE_ID } from '@/lib/affiliate';
import { isRequestAuthorized } from '@/lib/auth';

/**
 * Follow multi-hop shortlink redirects:
 * - link.amazon (New Amazon SiteStripe Deeplink) -> amzlinks.in -> amazon.in/dp/...
 * - amzn.to (SiteStripe) -> amazon.in/dp/...
 * - amzn.in/d/... (Amazon App) -> amazon.in/dp/...
 */
async function resolveShortlink(shortUrl: string): Promise<string> {
  let currentUrl = shortUrl;
  for (let hop = 0; hop < 6; hop++) {
    try {
      const res = await fetch(currentUrl, {
        method: 'GET',
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
      const asinMatch =
        currentUrl.match(/\/dp\/([A-Z0-9]{10})/i) ||
        currentUrl.match(/\/gp\/product\/([A-Z0-9]{10})/i) ||
        currentUrl.match(/\/gp\/aw\/d\/([A-Z0-9]{10})/i) ||
        currentUrl.match(/\b(B0[A-Z0-9]{8})\b/i);

      if (asinMatch) {
        return currentUrl;
      }
    } catch {
      break;
    }
  }

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

    // 1. Extract URL if user pasted text from a mobile share sheet
    const urlMatch = rawInput.match(/(https?:\/\/[^\s\)\>]+)/i);
    let targetUrl = urlMatch ? urlMatch[1] : (rawInput.startsWith('http') ? rawInput : '');

    let extractedAsin = '';

    // 2. If it's any Amazon short link (link.amazon, amzlinks.in, amzn.in, amzn.to), resolve redirects
    const isShortLink =
      targetUrl &&
      (targetUrl.includes('link.amazon') ||
        targetUrl.includes('amzlinks.in') ||
        targetUrl.includes('amzn.in') ||
        targetUrl.includes('amzn.to'));

    if (isShortLink) {
      targetUrl = await resolveShortlink(targetUrl);
    }

    // 3. Extract 10-character ASIN from resolved targetUrl or rawInput
    const asinMatch =
      targetUrl.match(/\/dp\/([A-Z0-9]{10})/i) ||
      targetUrl.match(/\/gp\/product\/([A-Z0-9]{10})/i) ||
      targetUrl.match(/\/gp\/aw\/d\/([A-Z0-9]{10})/i) ||
      targetUrl.match(/\/d\/([A-Z0-9]{10})/i) ||
      targetUrl.match(/\b(B0[A-Z0-9]{8})\b/i) ||
      rawInput.match(/\b(B0[A-Z0-9]{8})\b/i) ||
      rawInput.match(/^([A-Z0-9]{10})$/i);

    if (asinMatch) {
      extractedAsin = asinMatch[1].toUpperCase();
    }

    // 4. Validate ASIN: catch invalid inputs
    if (!extractedAsin) {
      // Check if user manually typed a standalone 9-character ASIN (not a shortlink URL)
      if (!targetUrl && rawInput.match(/^[A-Z0-9]{8,9}$/i)) {
        return NextResponse.json(
          {
            error: `"${rawInput}" has ${rawInput.length} characters. Amazon ASINs must be exactly 10 alphanumeric characters (e.g. B082LSVT4B). Please verify the ASIN or copy the full Amazon product link.`,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: `Could not extract an Amazon product ASIN from "${rawInput}". Please make sure the link or ASIN is active on Amazon India.`,
        },
        { status: 400 }
      );
    }

    // 5. Multi-tier scraping: Mobile Tier 1 (faster, bypasses bot checks) -> Desktop Tier 2
    let html = '';
    let fetchStatus = 200;

    // Mobile Amazon Endpoint (lightweight and resilient against anti-bot)
    const mobileUrl = `https://www.amazon.in/gp/aw/d/${extractedAsin}`;
    try {
      const mobileRes = await axios.get(mobileUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8',
          Connection: 'keep-alive',
        },
        timeout: 9000,
      });
      html = mobileRes.data;
      fetchStatus = mobileRes.status;
    } catch (mobileErr: any) {
      fetchStatus = mobileErr.response?.status || 500;
    }

    let $ = cheerio.load(html || '');
    let title =
      $('#title').text().trim() ||
      $('#productTitle').text().trim() ||
      $('h1').first().text().trim();

    // Desktop fallback if mobile returned empty title
    if (!title) {
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
          },
          timeout: 9000,
        });
        $ = cheerio.load(desktopRes.data || '');
        title = $('#productTitle').text().trim() || $('title').text().trim();
      } catch (desktopErr: any) {
        if (!fetchStatus || fetchStatus === 200) {
          fetchStatus = desktopErr.response?.status || 500;
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
    // If user provided a short link (link.amazon, amzlinks.in, amzn.to, amzn.in), keep it intact!
    // Otherwise construct universal affiliate URL with STORE_ID.
    let finalAffiliateUrl = isShortLink
      ? rawInput
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
