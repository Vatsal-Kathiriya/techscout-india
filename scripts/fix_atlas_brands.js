const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const match = env.match(/MONGODB_URI=["']?([^"'\r\n]+)["']?/);
const uri = match ? match[1] : null;

async function run() {
  if (!uri) {
    console.error('No MONGODB_URI found');
    process.exit(1);
  }
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const productsCol = db.collection('products');
  const products = await productsCol.find({}).toArray();

  let updatedCount = 0;
  for (const p of products) {
    if (!p.brand || p.brand.trim().toLowerCase() === 'genztech') {
      const firstWord = (p.title || '').trim().split(/\s+/)[0]?.replace(/[®™:,.-]+$/g, '').trim() || 'Generic';
      await productsCol.updateOne(
        { _id: p._id },
        { $set: { brand: firstWord } }
      );
      console.log(`Updated "${p.title.slice(0, 30)}..." brand: "${p.brand}" -> "${firstWord}"`);
      updatedCount++;
    }
  }

  console.log(`\nSuccessfully updated ${updatedCount} products in Atlas.`);
  await mongoose.disconnect();
}

run().catch(console.error);
