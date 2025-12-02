const mongoose = require('mongoose');

async function connectDB() {
  const uri = "mongodb+srv://i233030_db_user:uiUQEj8Yw1dfu3Um@cluster0.td6wdcj.mongodb.net/vaultDB?appName=Cluster0";

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

module.exports = connectDB;

