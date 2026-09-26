const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'products.json');

function getProducts() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function saveProducts(products) {
  fs.writeFileSync(dbPath, JSON.stringify(products, null, 2));
}

// Mix of US/India ASINs just to test
const asins = [
  'B0CHX1W1XY', // iPhone 15
  'B09Y233PDQ', // Sony WH-1000XM5
  'B0B11QZVTV', // Logitech MX Master 3S
];

async function seed() {
  console.log('Using local JSON DB');
  let products = getProducts();

  for (const asin of asins) {
    if (products.some(p => p.asin === asin)) {
      console.log(`Already have ${asin}, skipping.`);
      continue;
    }
    console.log(`Fetching ASIN: ${asin}`);
    try {
      const { data } = await axios.get(`https://www.amazon.in/dp/${asin}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Cache-Control': 'max-age=0',
        }
      });

      const $ = cheerio.load(data);
      const title = $('#productTitle').text().trim();
      let price = $('.a-price-whole').first().text().trim();
      if (!price) price = $('#priceblock_ourprice').text().trim();
      if (!price) price = $('#priceblock_dealprice').text().trim();
      price = price.replace(/\.$/, '');

      let imageUrl = $('#landingImage').attr('src');
      if (!imageUrl) {
        const dynamicImageStr = $('#landingImage').attr('data-a-dynamic-image');
        if (dynamicImageStr) {
          imageUrl = Object.keys(JSON.parse(dynamicImageStr))[0];
        }
      }

      if (title) {
        const newProduct = {
          _id: Date.now().toString() + Math.floor(Math.random() * 1000),
          title,
          price: price ? `₹${price}` : 'Price not available',
          imageUrl,
          url: `https://www.amazon.in/dp/${asin}`,
          affiliateUrl: `https://www.amazon.in/dp/${asin}?tag=genztech019-21`,
          asin,
          createdAt: new Date().toISOString()
        };
        products.unshift(newProduct);
        saveProducts(products);
        console.log(`Saved: ${title}`);
      } else {
        console.log(`Failed to extract title for ${asin}. Amazon may have served a captcha.`);
      }

    } catch (e) {
      console.log(`Error for ${asin}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  
  process.exit(0);
}

seed();
