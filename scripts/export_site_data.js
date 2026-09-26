const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'products.json'), 'utf8'));
const guides = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'guides.json'), 'utf8'));
const campaigns = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'campaigns.json'), 'utf8'));
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'site-config.json'), 'utf8'));

const payload = {
  exportedAt: new Date().toISOString(),
  config,
  campaigns,
  guides,
  products,
};

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'site-data.json'), JSON.stringify(payload, null, 2));
console.log(`Exported ${products.length} products to public/site-data.json`);
