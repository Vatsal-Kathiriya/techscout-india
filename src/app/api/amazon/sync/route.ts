import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { STORE_ID } from '@/lib/affiliate';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawInput = (body.input || body.url || body.asin || '').trim();

    if (!rawInput) {
      return NextResponse.json({ error: 'URL or ASIN is required' }, { status: 400 });
    }

    let targetUrl = rawInput;
    let extractedAsin = '';

    // Check if input is a URL
    if (rawInput.startsWith('http://') || rawInput.startsWith('https://')) {
      // If it's a short link (link.amazon, amzn.to, amzn.in), resolve the redirect
      if (
        rawInput.includes('link.amazon') ||
        rawInput.includes('amzn.to') ||
        rawInput.includes('amzn.in')
      ) {
        try {
          const redirectRes = await axios.get(rawInput, {
            maxRedirects: 10,
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              Accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            },
          });
          const finalUrl = redirectRes.request?.res?.responseUrl;
          if (finalUrl) {
            targetUrl = finalUrl;
          }
        } catch (e: any) {
          console.warn('Could not follow short link redirect:', e.message);
        }
      }

      // Extract ASIN from target URL
      const asinMatch =
        targetUrl.match(/\/dp\/([A-Z0-9]{10})/i) ||
        targetUrl.match(/\/gp\/product\/([A-Z0-9]{10})/i) ||
        targetUrl.match(/\/d\/([A-Z0-9]{10})/i);
      if (asinMatch) {
        extractedAsin = asinMatch[1];
      }
    } else {
      // Input is likely an ASIN directly
      const asinMatch = rawInput.match(/\b([A-Z0-9]{10})\b/i);
      extractedAsin = asinMatch ? asinMatch[1] : rawInput;
    }

    const fetchUrl = extractedAsin
      ? `https://www.amazon.in/dp/${extractedAsin}`
      : targetUrl;

    // Fetch page data with custom headers
    const { data } = await axios.get(fetchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
      },
    });

    const $ = cheerio.load(data);

    // Extract Title
    const title = $('#productTitle').text().trim();

    // Extract Price
    let price = $('.a-price-whole').first().text().trim();
    if (!price) {
      price = $('#priceblock_ourprice').text().trim();
    }
    if (!price) {
      price = $('#priceblock_dealprice').text().trim();
    }
    price = price.replace(/\.$/, '');

    // Extract Image
    let imageUrl = $('#landingImage').attr('src');
    if (!imageUrl) {
      const dynamicImageStr = $('#landingImage').attr('data-a-dynamic-image');
      if (dynamicImageStr) {
        try {
          const dynamicImages = JSON.parse(dynamicImageStr);
          imageUrl = Object.keys(dynamicImages)[0];
        } catch {
          // ignore json parse error
        }
      }
    }

    // Extract Ratings & Reviews
    let ratingStr = $('#acrPopover').attr('title');
    if (!ratingStr) ratingStr = $('.a-icon-star .a-icon-alt').first().text();
    let rating = '4.5';
    if (ratingStr && ratingStr.match(/(\d\.\d)/)) {
      rating = ratingStr.match(/(\d\.\d)/)![1];
    }

    let reviewStr = $('#acrCustomerReviewText').first().text().trim();
    let reviews = '1,420';
    if (reviewStr) {
      reviews = reviewStr.split(' ')[0];
    }

    if (!title) {
      return NextResponse.json(
        { error: 'Failed to extract data. Amazon may have blocked the request.' },
        { status: 500 }
      );
    }

    // Determine final affiliate URL:
    // If user provided a short link or full affiliate URL, keep it!
    // Otherwise construct universal affiliate URL.
    let finalAffiliateUrl = rawInput.startsWith('http')
      ? rawInput
      : `https://www.amazon.in/dp/${extractedAsin || rawInput}?tag=${STORE_ID}`;

    return NextResponse.json({
      asin: extractedAsin || rawInput,
      title,
      price: price ? `₹${price}` : 'Price not available',
      imageUrl: imageUrl || '',
      url: `https://www.amazon.in/dp/${extractedAsin || rawInput}`,
      affiliateUrl: finalAffiliateUrl,
      rating,
      reviews,
    });
  } catch (error: any) {
    console.error('Amazon Sync Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch data from Amazon.' },
      { status: 500 }
    );
  }
}
