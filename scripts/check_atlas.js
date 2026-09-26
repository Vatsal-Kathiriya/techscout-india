const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

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

console.log('Connecting to MongoDB Atlas...');
mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 })
  .then(async () => {
    console.log('SUCCESS: Connected to MongoDB Atlas cluster at genz-tech.sr0iu6z.mongodb.net!');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collections:`);
    for (const c of collections) {
      const count = await db.collection(c.name).countDocuments();
      console.log(` • ${c.name}: ${count} documents`);
    }
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(err => {
    console.error('ERROR connecting to MongoDB Atlas:', err.message);
    process.exit(1);
  });
