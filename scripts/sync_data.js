const fs = require('fs');
const path = require('path');

// Read initialData.ts or parse it
const productsPath = path.join(__dirname, '..', 'products.json');
let existing = [];
if (fs.existsSync(productsPath)) {
  try {
    existing = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    if (!Array.isArray(existing)) existing = [existing];
  } catch (e) {
    existing = [];
  }
}

console.log('Current products count in products.json:', existing.length);
