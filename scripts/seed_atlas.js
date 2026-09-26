const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let uri = process.env.MONGODB_URI;
if (!uri) {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=["']?([^"'\r\n]+)["']?/);
    if (match) uri = match[1];
  }
}

if (!uri) {
  console.error('ERROR: MONGODB_URI environment variable is required.');
  process.exit(1);
}

async function seedAtlas() {
  console.log('Connecting to MongoDB Atlas at genz-tech.sr0iu6z.mongodb.net...');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected successfully!');

  const db = mongoose.connection.db;

  // 1. Seed Products
  const products = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'products.json'), 'utf8'));
  console.log(`Found ${products.length} products to seed.`);
  const productsCol = db.collection('products');
  await productsCol.deleteMany({});
  await productsCol.insertMany(products);
  console.log(`✓ Seeded ${products.length} products into 'products' collection.`);

  // 2. Seed Guides
  const guides = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'guides.json'), 'utf8'));
  console.log(`Found ${guides.length} guides to seed.`);
  const guidesCol = db.collection('guides');
  await guidesCol.deleteMany({});
  await guidesCol.insertMany(guides);
  console.log(`✓ Seeded ${guides.length} guides into 'guides' collection.`);

  // 3. Seed Campaigns
  const campaigns = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'campaigns.json'), 'utf8'));
  console.log(`Found ${campaigns.length} campaigns to seed.`);
  const campaignsCol = db.collection('campaigns');
  await campaignsCol.deleteMany({});
  await campaignsCol.insertMany(campaigns);
  console.log(`✓ Seeded ${campaigns.length} campaigns into 'campaigns' collection.`);

  // 4. Seed SiteConfig
  const siteConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'site-config.json'), 'utf8'));
  const configCol = db.collection('siteconfig');
  await configCol.deleteMany({});
  await configCol.insertOne({ _id: 'global-config', ...siteConfig });
  console.log(`✓ Seeded site configuration into 'siteconfig' collection.`);

  // Summary verification
  console.log('\n--- VERIFICATION OF ATLAS COLLECTIONS ---');
  const collections = await db.listCollections().toArray();
  for (const c of collections) {
    const count = await db.collection(c.name).countDocuments();
    console.log(`• Collection: ${c.name} -> ${count} documents`);
  }

  await mongoose.disconnect();
  console.log('\nMongoDB Atlas database seeding complete!');
  process.exit(0);
}

seedAtlas().catch(err => {
  console.error('Atlas seeding error:', err);
  process.exit(1);
});
