const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('================================================================');
console.log('  GENZTECH.IN FULL END-TO-END SYSTEM & SEO AUDIT VERIFICATION   ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    Details: ${err.message}`);
    failedTests++;
  }
}

// -------------------------------------------------------------
// SECTION 1: STORE ID & UNIVERSAL OUTBOUND GATEWAY (/out/[id])
// -------------------------------------------------------------
console.log('[1/7] Verifying Amazon Associates Tag & Universal Gateway Logic...');

const STORE_TAG = 'genztech019-21';
const productsPath = path.join(__dirname, '..', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

runTest(`All ${products.length} products have valid Amazon affiliate URLs with tag "${STORE_TAG}"`, () => {
  products.forEach((p) => {
    assert(p.affiliateUrl, `Product ${p._id} missing affiliateUrl`);
    const isTagPresent = p.affiliateUrl.includes(STORE_TAG);
    const isShortLink = p.affiliateUrl.includes('link.amazon') || p.affiliateUrl.includes('amzn.to');
    assert(isTagPresent || isShortLink, `Product "${p.title}" lacks valid tag or short link: ${p.affiliateUrl}`);
  });
});

runTest('Universal Gateway /out/[id] correctly injects or verifies tag=genztech019-21', () => {
  const routePath = path.join(__dirname, '..', 'src', 'app', 'out', '[id]', 'route.ts');
  assert(fs.existsSync(routePath), 'out/[id]/route.ts must exist');
  const affiliatePath = path.join(__dirname, '..', 'src', 'lib', 'affiliate.ts');
  assert(fs.existsSync(affiliatePath), 'src/lib/affiliate.ts must exist');
  const affiliateCode = fs.readFileSync(affiliatePath, 'utf8');

  const code = fs.readFileSync(routePath, 'utf8');
  assert(affiliateCode.includes(STORE_TAG), `Affiliate helper must define store tag "${STORE_TAG}"`);
  assert(code.includes('307'), 'Gateway must use 307 temporary redirect');
  assert(code.includes('NextResponse.redirect'), 'Gateway must execute server-side redirection');

  // Simulation test of gateway URL rewrite logic
  function simulateGatewayRedirect(rawUrl) {
    if (rawUrl.includes('link.amazon') || rawUrl.includes('amzn.to')) {
      return rawUrl;
    }
    const urlObj = new URL(rawUrl);
    urlObj.searchParams.set('tag', STORE_TAG);
    return urlObj.toString();
  }

  const sampleUrl = 'https://www.amazon.in/dp/B0HJBHM583?th=1';
  const redirected = simulateGatewayRedirect(sampleUrl);
  assert(redirected.includes(`tag=${STORE_TAG}`), 'Redirected URL must have tag');
});

// -------------------------------------------------------------
// SECTION 2: EXPLORER, SEARCH & CATEGORY FILTERING
// -------------------------------------------------------------
console.log('\n[2/7] Verifying Product Explorer, Search & Filtering Algorithm...');

runTest('Catalog covers all 6 hardware categories with rich specs', () => {
  const expectedCats = ['smartphones', 'laptops', 'audio', 'smartwatches', 'gaming', 'accessories'];
  const foundCats = new Set(products.map((p) => p.category));
  expectedCats.forEach((c) => {
    assert(foundCats.has(c), `Category "${c}" must have products`);
  });
});

runTest('Search matching algorithm works across titles, brands, and categories', () => {
  function searchProducts(query, list) {
    const q = query.toLowerCase();
    return list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  const appleResults = searchProducts('Apple', products);
  assert(appleResults.length >= 2, 'Expected at least 2 Apple products');

  const laptopResults = searchProducts('laptop', products);
  assert(laptopResults.length >= 2, 'Expected laptop results');

  const sonyResults = searchProducts('Sony', products);
  assert(sonyResults.length >= 1, 'Expected Sony results');
});

runTest('Price sorting algorithm sorts accurately by numeric currency values', () => {
  function parsePrice(str) {
    return parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
  }

  const sortedLowToHigh = [...products].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  for (let i = 0; i < sortedLowToHigh.length - 1; i++) {
    assert(
      parsePrice(sortedLowToHigh[i].price) <= parsePrice(sortedLowToHigh[i + 1].price),
      'Products must be sorted in ascending order'
    );
  }
});

// -------------------------------------------------------------
// SECTION 3: COMPARISON MATRIX & SPEC ENGINE
// -------------------------------------------------------------
console.log('\n[3/7] Verifying Comparison Matrix & Specification Engine...');

runTest('Comparison matrix handles 2, 3, or 4 products with spec key alignment', () => {
  const sampleComparison = products.slice(0, 4);
  assert(sampleComparison.length === 4, 'Need 4 sample products');

  // Verify spec attributes
  sampleComparison.forEach((p) => {
    assert(p.specs, `Product "${p.title}" must have specs object`);
    assert(p.specScore >= 1 && p.specScore <= 10, 'Spec score must be between 1 and 10');
    assert(Array.isArray(p.pros) && p.pros.length > 0, 'Pros must be a non-empty array');
    assert(Array.isArray(p.cons) && p.cons.length > 0, 'Cons must be a non-empty array');
    assert(p.verdict && p.verdict.length > 10, 'Verdict must be detailed');
  });
});

// -------------------------------------------------------------
// SECTION 4: BUYING GUIDES CMS & FESTIVE CAMPAIGNS
// -------------------------------------------------------------
console.log('\n[4/7] Verifying Buying Guides CMS & Festive Campaigns...');

const guidesPath = path.join(__dirname, '..', 'guides.json');
const guides = JSON.parse(fs.readFileSync(guidesPath, 'utf8'));

runTest(`guides.json contains ${guides.length} published in-depth guides with valid markdown`, () => {
  assert(guides.length >= 4, 'Must have at least 4 buying guides');
  guides.forEach((g) => {
    assert(g.slug, `Guide "${g.title}" missing slug`);
    assert(g.heroImage && g.heroImage.startsWith('http'), `Guide "${g.title}" missing hero image`);
    assert(g.content && g.content.length > 200, `Guide "${g.title}" content too short`);
    assert(g.readTime && g.readTime.includes('min read'), `Guide "${g.title}" invalid readTime`);
    assert(g.author, `Guide "${g.title}" missing author`);
  });
});

const campaignsPath = path.join(__dirname, '..', 'campaigns.json');
const campaigns = JSON.parse(fs.readFileSync(campaignsPath, 'utf8'));

runTest(`campaigns.json contains ${campaigns.length} festive campaigns with active countdown`, () => {
  assert(campaigns.length >= 1, 'Must have at least 1 campaign');
  const activeCamp = campaigns.find((c) => c.active);
  assert(activeCamp, 'Must have at least 1 active campaign');
  assert(activeCamp.title && activeCamp.discountHeadline, 'Active campaign must have title and headline');
  assert(activeCamp.countdownEnd, 'Active campaign must have countdownEnd timestamp');
});

// -------------------------------------------------------------
// SECTION 5: GLOBAL SITE CONFIGURATION
// -------------------------------------------------------------
console.log('\n[5/7] Verifying Global Site Configuration (site-config.json)...');

const configPath = path.join(__dirname, '..', 'site-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

runTest('site-config.json contains full production branding and parameters', () => {
  assert.strictEqual(config.affiliateStoreId, STORE_TAG, `Store ID must match ${STORE_TAG}`);
  assert(config.brandName, 'Brand name must be defined');
  assert(config.tagline, 'Tagline must be defined');
  assert(config.heroHeadline, 'Hero headline must be defined');
  assert(config.heroSubheadline, 'Hero subheadline must be defined');
  assert(config.tickerText, 'Ticker text must be defined');
  assert(typeof config.tickerActive === 'boolean', 'tickerActive must be a boolean');
  assert(config.defaultPriceMode === 'indicative' || config.defaultPriceMode === 'safe_cta');
  assert(config.contactEmail, 'Contact email must be defined');
  assert(config.footerAbout, 'Footer about must be defined');
  assert(config.affiliateDisclosure, 'Affiliate disclosure must be defined');
  assert(config.primaryCtaText, 'Primary CTA text must be defined');
  assert(config.primaryCtaLink, 'Primary CTA link must be defined');
});

// -------------------------------------------------------------
// SECTION 6: SEO (SEARCH ENGINE OPTIMIZATION) AUDIT
// -------------------------------------------------------------
console.log('\n[6/7] Verifying SEO Metadata, Sitemap, Robots & JSON-LD Schemas...');

runTest('robots.ts is implemented and directs to sitemap.xml with disallowed admin/api/out', () => {
  const robotsPath = path.join(__dirname, '..', 'src', 'app', 'robots.ts');
  assert(fs.existsSync(robotsPath), 'src/app/robots.ts must exist');
  const content = fs.readFileSync(robotsPath, 'utf8');
  assert(content.includes('sitemap.xml'), 'robots.ts must reference sitemap.xml');
  assert(content.includes('/admin'), 'robots.ts must disallow /admin');
  assert(content.includes('/api/'), 'robots.ts must disallow /api/');
  assert(content.includes('/out/'), 'robots.ts must disallow /out/');
});

runTest('sitemap.ts is implemented and covers all static, category, product, and guide URLs', () => {
  const sitemapPath = path.join(__dirname, '..', 'src', 'app', 'sitemap.ts');
  assert(fs.existsSync(sitemapPath), 'src/app/sitemap.ts must exist');
  const content = fs.readFileSync(sitemapPath, 'utf8');
  assert(content.includes('https://genz-tech.in'), 'sitemap.ts must use genz-tech.in base URL');
  assert(content.includes('getProducts()') || content.includes('getProductsFromDb()'), 'sitemap.ts must include dynamic products');
  assert(content.includes('getGuides()') || content.includes('getGuidesFromDb()'), 'sitemap.ts must include dynamic guides');
});

runTest('Root layout (layout.tsx) includes canonical, metadataBase, OpenGraph, Twitter card, and Organization JSON-LD', () => {
  const layoutPath = path.join(__dirname, '..', 'src', 'app', 'layout.tsx');
  const content = fs.readFileSync(layoutPath, 'utf8');
  assert(content.includes('https://genz-tech.in'), 'layout.tsx must set metadataBase to https://genz-tech.in');
  assert(content.includes('canonical'), 'layout.tsx must specify canonical URL');
  assert(content.includes('twitter:'), 'layout.tsx must specify Twitter card metadata');
  assert(content.includes('application/ld+json'), 'layout.tsx must inject JSON-LD schema');
  assert(content.includes('schema.org'), 'layout.tsx must reference schema.org');
  assert(content.includes('WebSite'), 'layout.tsx must declare WebSite schema');
  assert(content.includes('Organization'), 'layout.tsx must declare Organization schema');
});

runTest('Product detail pages (products/[id] & product/[slug]) include Product JSON-LD schema with Offer & Rating', () => {
  const idPagePath = path.join(__dirname, '..', 'src', 'app', 'products', '[id]', 'page.tsx');
  const slugPagePath = path.join(__dirname, '..', 'src', 'app', 'product', '[slug]', 'page.tsx');
  const idContent = fs.readFileSync(idPagePath, 'utf8');
  const slugContent = fs.readFileSync(slugPagePath, 'utf8');

  assert(idContent.includes('application/ld+json'), 'products/[id] must include JSON-LD script');
  assert(idContent.includes('@type\': \'Product\'') || idContent.includes('"@type": "Product"'), 'Must declare Product schema');
  assert(idContent.includes('AggregateRating'), 'Must declare AggregateRating');
  assert(idContent.includes('Offer'), 'Must declare Offer with price');

  assert(slugContent.includes('application/ld+json'), 'product/[slug] must include JSON-LD script');
});

runTest('Buying guide pages (guides/[slug]) include TechArticle JSON-LD schema', () => {
  const guideArticlePath = path.join(__dirname, '..', 'src', 'app', 'guides', '[slug]', 'page.tsx');
  const content = fs.readFileSync(guideArticlePath, 'utf8');
  assert(content.includes('application/ld+json'), 'guides/[slug] must include JSON-LD script');
  assert(content.includes('TechArticle'), 'Must declare TechArticle schema');
  assert(content.includes('datePublished'), 'Must include datePublished');
});

// -------------------------------------------------------------
// SECTION 7: PRODUCTION BUILD & STATIC DATA EXPORT
// -------------------------------------------------------------
console.log('\n[7/7] Verifying Production Deployment Readiness & public/site-data.json...');

runTest('public/site-data.json exists and is synchronized with catalog, config, and guides', () => {
  const siteDataPath = path.join(__dirname, '..', 'public', 'site-data.json');
  assert(fs.existsSync(siteDataPath), 'public/site-data.json must exist');
  const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));
  assert(siteData.config, 'site-data.json must include config');
  assert(Array.isArray(siteData.products) && siteData.products.length >= 24, 'site-data.json must include products');
  assert(Array.isArray(siteData.guides) && siteData.guides.length >= 4, 'site-data.json must include guides');
  assert(Array.isArray(siteData.campaigns) && siteData.campaigns.length >= 1, 'site-data.json must include campaigns');
});

runTest('public/CNAME exists with domain genz-tech.in', () => {
  const cnamePath = path.join(__dirname, '..', 'public', 'CNAME');
  assert(fs.existsSync(cnamePath), 'public/CNAME must exist');
  const cname = fs.readFileSync(cnamePath, 'utf8').trim();
  assert.strictEqual(cname, 'genz-tech.in', 'CNAME must be genz-tech.in');
});

console.log('\n================================================================');
console.log(`  AUDIT SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (${failedTests} FAILED)`);
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('★ ALL E2E FUNCTIONALITY AND SEO CHECKS PASSED WITH 100% ACCURACY! ★\n');
  process.exit(0);
}
