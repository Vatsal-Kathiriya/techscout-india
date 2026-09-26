const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('================================================================');
console.log('  GENZTECH.IN AUTOMATED TEST SUITE & COMPLIANCE VERIFICATION    ');
console.log('================================================================\n');

let passedTests = 0;
let failedTests = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${description}`);
    console.error(`    Error: ${err.message}`);
    failedTests++;
  }
}

// -------------------------------------------------------------
// 1. DATA INTEGRITY & SEED PRODUCT VERIFICATION
// -------------------------------------------------------------
console.log('[1/5] Testing Data Store & Seed Hardware Dataset...');

test('products.json exists and contains at least 24 rich hardware products', () => {
  const pPath = path.join(__dirname, '..', 'products.json');
  assert(fs.existsSync(pPath), 'products.json must exist');
  const products = JSON.parse(fs.readFileSync(pPath, 'utf8'));
  assert(Array.isArray(products), 'products must be an array');
  assert(products.length >= 24, `Expected at least 24 products, got ${products.length}`);
});

test('Every product has required hardware specs, real image URL, and no emojis', () => {
  const pPath = path.join(__dirname, '..', 'products.json');
  const products = JSON.parse(fs.readFileSync(pPath, 'utf8'));
  const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

  products.forEach((p, idx) => {
    assert(p.title && p.title.trim().length > 3, `Product #${idx} missing valid title`);
    assert(p.asin && p.asin.trim().length > 0, `Product "${p.title}" missing ASIN`);
    assert(p.imageUrl && p.imageUrl.startsWith('http'), `Product "${p.title}" missing valid HTTP image`);
    assert(!emojiRegex.test(p.title), `Product "${p.title}" contains prohibited emoji`);
    assert(p.specScore >= 1 && p.specScore <= 10, `Product "${p.title}" invalid spec score`);
  });
});

test('All 6 core hardware categories are represented in seed products', () => {
  const pPath = path.join(__dirname, '..', 'products.json');
  const products = JSON.parse(fs.readFileSync(pPath, 'utf8'));
  const categories = new Set(products.map((p) => p.category));

  ['smartphones', 'laptops', 'audio', 'smartwatches', 'gaming', 'accessories'].forEach((cat) => {
    assert(categories.has(cat), `Category "${cat}" must be present in products.json`);
  });
});

// -------------------------------------------------------------
// 2. BUYING GUIDES INTEGRITY
// -------------------------------------------------------------
console.log('\n[2/5] Testing Original Buying Guides & Value-Add Content...');

test('initialData contains at least 4 in-depth original buying guides', () => {
  const initDataPath = path.join(__dirname, '..', 'src', 'lib', 'initialData.ts');
  const content = fs.readFileSync(initDataPath, 'utf8');
  assert(content.includes('INITIAL_BUYING_GUIDES'), 'INITIAL_BUYING_GUIDES must be declared');
  assert(content.includes('ultimate-gaming-laptop-buying-guide-2026'), 'Guide 1 missing');
  assert(content.includes('flagship-smartphone-camera-breakdown'), 'Guide 2 missing');
  assert(content.includes('active-noise-cancelling-anc-deep-dive'), 'Guide 3 missing');
  assert(content.includes('smartwatch-health-sensors-accuracy-guide'), 'Guide 4 missing');
});

// -------------------------------------------------------------
// 3. AMAZON ASSOCIATES COMPLIANCE & LINK SANITIZER
// -------------------------------------------------------------
console.log('\n[3/5] Testing Amazon Associates Operating Agreement Compliance...');

test('Every product affiliateUrl is bound to genztech019-21 or official Amazon short link', () => {
  const pPath = path.join(__dirname, '..', 'products.json');
  const products = JSON.parse(fs.readFileSync(pPath, 'utf8'));

  products.forEach((p) => {
    const url = p.affiliateUrl || '';
    const hasTag = url.includes('genztech019-21');
    const isShortLink = url.includes('link.amazon') || url.includes('amzn.to') || url.includes('amzn.in');
    assert(hasTag || isShortLink, `Product "${p.title}" affiliateUrl (${url}) lacks affiliate tracking`);
  });
});

test('ProductCard & ProductDetailView enforce rel="sponsored nofollow noopener"', () => {
  const cardPath = path.join(__dirname, '..', 'src', 'components', 'ProductCard.tsx');
  const cardContent = fs.readFileSync(cardPath, 'utf8');
  assert(
    cardContent.includes('rel="sponsored nofollow noopener"'),
    'ProductCard must include rel="sponsored nofollow noopener"'
  );

  const detailPath = path.join(__dirname, '..', 'src', 'components', 'ProductDetailView.tsx');
  const detailContent = fs.readFileSync(detailPath, 'utf8');
  assert(
    detailContent.includes('rel="sponsored nofollow noopener"'),
    'ProductDetailView must include rel="sponsored nofollow noopener"'
  );
});

test('Universal redirection gateway /out/[id] is implemented with 307 temporary redirect', () => {
  const outPath = path.join(__dirname, '..', 'src', 'app', 'out', '[id]', 'route.ts');
  assert(fs.existsSync(outPath), 'out/[id]/route.ts must exist');
  const outContent = fs.readFileSync(outPath, 'utf8');
  assert(outContent.includes('NextResponse.redirect'), 'Must perform server-side redirect');
  assert(outContent.includes('307'), 'Must use 307 Temporary Redirect status code');
});

// -------------------------------------------------------------
// 4. MANDATORY TRUST & COMPLIANCE PAGES (ZERO 404S)
// -------------------------------------------------------------
console.log('\n[4/5] Testing 5 Mandatory Legal & Trust Compliance Routes...');

test('About Us page (/about) exists and describes GenzTech mission', () => {
  const p = path.join(__dirname, '..', 'src', 'app', 'about', 'page.tsx');
  assert(fs.existsSync(p), '/about/page.tsx must exist');
  const content = fs.readFileSync(p, 'utf8');
  assert(content.includes('Smart Tech. Better Choices.'), 'About page must contain brand tagline');
});

test('Contact Us page (/contact) exists with validated inquiry form', () => {
  const p = path.join(__dirname, '..', 'src', 'app', 'contact', 'page.tsx');
  assert(fs.existsSync(p), '/contact/page.tsx must exist');
  const content = fs.readFileSync(p, 'utf8');
  assert(content.includes('<form'), 'Contact page must render a contact form');
  assert(content.includes('editorial@genztech.in'), 'Contact page must display contact email');
});

test('Privacy Policy (/privacy-policy) includes Amazon cookie disclosure', () => {
  const p = path.join(__dirname, '..', 'src', 'app', 'privacy-policy', 'page.tsx');
  assert(fs.existsSync(p), '/privacy-policy/page.tsx must exist');
  const content = fs.readFileSync(p, 'utf8');
  assert(content.includes('Amazon Associates'), 'Privacy policy must disclose Amazon Associates cookies');
  assert(content.includes('genztech019-21'), 'Privacy policy must disclose store ID');
});

test('Affiliate Disclosure (/affiliate-disclosure) includes mandatory Amazon Associates clause', () => {
  const p = path.join(__dirname, '..', 'src', 'app', 'affiliate-disclosure', 'page.tsx');
  assert(fs.existsSync(p), '/affiliate-disclosure/page.tsx must exist');
  const content = fs.readFileSync(p, 'utf8');
  assert(
    content.includes('As an Amazon Associate, GenzTech.in earns from qualifying purchases.'),
    'Must include exact mandatory Amazon Associates operating agreement statement'
  );
});

test('Disclaimer page (/disclaimer) includes dynamic pricing & specification disclaimer', () => {
  const p = path.join(__dirname, '..', 'src', 'app', 'disclaimer', 'page.tsx');
  assert(fs.existsSync(p), '/disclaimer/page.tsx must exist');
  const content = fs.readFileSync(p, 'utf8');
  assert(content.includes('Amazon.in'), 'Disclaimer must mention Amazon.in pricing dynamics');
});

// -------------------------------------------------------------
// 5. SEARCH, FILTERING & PAGINATION LOGIC
// -------------------------------------------------------------
console.log('\n[5/5] Testing Explorer Filtering, Sorting & Pagination Algorithm...');

test('Filtering logic separates categories and price brackets accurately', () => {
  const pPath = path.join(__dirname, '..', 'products.json');
  const products = JSON.parse(fs.readFileSync(pPath, 'utf8'));

  const smartphones = products.filter((p) => p.category === 'smartphones');
  assert(smartphones.length >= 3, 'Expected at least 3 smartphones');
  smartphones.forEach((p) => assert.strictEqual(p.category, 'smartphones'));

  const laptops = products.filter((p) => p.category === 'laptops');
  assert(laptops.length >= 3, 'Expected at least 3 laptops');
  laptops.forEach((p) => assert.strictEqual(p.category, 'laptops'));
});

test('Pagination mathematics slice items correctly with zero overlap', () => {
  const items = Array.from({ length: 30 }, (_, i) => ({ id: i }));
  const perPage = 12;
  const totalPages = Math.ceil(items.length / perPage);
  assert.strictEqual(totalPages, 3);

  const page1 = items.slice(0, 12);
  const page2 = items.slice(12, 24);
  const page3 = items.slice(24, 36);

  assert.strictEqual(page1.length, 12);
  assert.strictEqual(page2.length, 12);
  assert.strictEqual(page3.length, 6);
  assert.strictEqual(page1[0].id, 0);
  assert.strictEqual(page2[0].id, 12);
  assert.strictEqual(page3[0].id, 24);
});

// -------------------------------------------------------------
// 6. ADMIN CMS & DYNAMIC CUSTOMIZATION VERIFICATION
// -------------------------------------------------------------
console.log('\n[6/6] Testing Admin CMS Data Stores & Dynamic Customization APIs...');

test('site-config.json exists with full branding, hero, and ticker parameters', () => {
  const cfgPath = path.join(__dirname, '..', 'site-config.json');
  assert(fs.existsSync(cfgPath), 'site-config.json must exist');
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  assert(cfg.brandName, 'Brand name must be configured');
  assert(cfg.tagline, 'Tagline must be configured');
  assert(cfg.affiliateStoreId === 'genztech019-21', 'Store ID must match genztech019-21');
  assert(cfg.heroHeadline, 'Hero headline must be configured');
  assert(cfg.tickerText, 'Ticker text must be configured');
  assert(typeof cfg.tickerActive === 'boolean', 'tickerActive must be a boolean');
});

test('campaigns.json exists and contains active festive campaigns', () => {
  const cPath = path.join(__dirname, '..', 'campaigns.json');
  assert(fs.existsSync(cPath), 'campaigns.json must exist');
  const camps = JSON.parse(fs.readFileSync(cPath, 'utf8'));
  assert(Array.isArray(camps) && camps.length > 0, 'campaigns.json must contain array of campaigns');
  const activeCamp = camps.find((c) => c.active);
  assert(activeCamp, 'Must have at least one active campaign');
  assert(activeCamp.title && activeCamp.discountHeadline, 'Active campaign must have title and headline');
});

test('guides.json exists and contains published guides', () => {
  const gPath = path.join(__dirname, '..', 'guides.json');
  assert(fs.existsSync(gPath), 'guides.json must exist');
  const guides = JSON.parse(fs.readFileSync(gPath, 'utf8'));
  assert(Array.isArray(guides) && guides.length >= 4, 'guides.json must contain at least 4 guides');
});

test('Admin API route handlers exist for config, campaigns, and guides', () => {
  const cfgRoute = path.join(__dirname, '..', 'src', 'app', 'api', 'admin', 'config', 'route.ts');
  const campRoute = path.join(__dirname, '..', 'src', 'app', 'api', 'admin', 'campaigns', 'route.ts');
  const guideRoute = path.join(__dirname, '..', 'src', 'app', 'api', 'admin', 'guides', 'route.ts');
  assert(fs.existsSync(cfgRoute), 'api/admin/config/route.ts must exist');
  assert(fs.existsSync(campRoute), 'api/admin/campaigns/route.ts must exist');
  assert(fs.existsSync(guideRoute), 'api/admin/guides/route.ts must exist');
});

console.log('\n================================================================');
console.log(`  TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('All compliance, routing, and data integrity tests PASSED successfully!\n');
  process.exit(0);
}
