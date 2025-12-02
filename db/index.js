require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");
const fs = require("fs");

const recordUtils = require("./record");
const vaultEvents = require("../events");

// -----------------------------
// 🔗 1. CONNECT TO MONGODB
// -----------------------------
//const uri = "mongodb+srv://i233030_db_user:uiUQEj8Yw1dfu3Um@cluster0.td6wdcj.mongodb.net/vaultDB?appName=Cluster0";
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);
let collection;

async function initDB() {
  await client.connect();
  const db = client.db("vaultDB");
  collection = db.collection("records");
  console.log("✅ MongoDB Connected Successfully");
}

initDB().catch(console.error);

// -----------------------------
// 📦 BACKUP SYSTEM (unchanged)
// -----------------------------
const backupsDir = path.join(__dirname, "..", "backups");
if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir);

async function createBackup() {
  const allRecords = await collection.find({}).toArray();
  const timestamp = new Date()
    .toISOString()
    .replace(/:/g, "-")
    .replace(/\..+/, "");
  const backupName = `backup_${timestamp}.json`;
  const backupPath = path.join(backupsDir, backupName);

  fs.writeFileSync(backupPath, JSON.stringify(allRecords, null, 2));
  console.log(`📦 Backup created successfully: ${backupName}`);
}

// -----------------------------
// 🟢 ADD RECORD
// -----------------------------
async function addRecord({ name, value }) {
  recordUtils.validateRecord({ name, value });

  const newRecord = {
    name,
    value,
    createdAt: new Date().toISOString(),
  };

  const result = await collection.insertOne(newRecord);
  newRecord.id = result.insertedId.toString();

  await createBackup();
  vaultEvents.emit("recordAdded", newRecord);

  return newRecord;
}

// -----------------------------
// 📜 LIST ALL RECORDS
// -----------------------------
async function listRecords() {
  const data = await collection.find({}).toArray();

  return data.map((r) => ({
    id: r._id.toString(),
    name: r.name,
    value: r.value,
    createdAt: r.createdAt,
  }));
}

// -----------------------------
// ✏️ UPDATE RECORD
// -----------------------------
async function updateRecord(id, newName, newValue) {
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { name: newName, value: newValue } },
    { returnDocument: "after" }
  );

  if (!result.value) return null;

  vaultEvents.emit("recordUpdated", result.value);

  return {
    id: result.value._id.toString(),
    name: result.value.name,
    value: result.value.value,
    createdAt: result.value.createdAt,
  };
}

// -----------------------------
// ❌ DELETE RECORD
// -----------------------------
async function deleteRecord(id) {
  const record = await collection.findOne({ _id: new ObjectId(id) });
  if (!record) return null;

  await collection.deleteOne({ _id: new ObjectId(id) });

  await createBackup();
  vaultEvents.emit("recordDeleted", record);

  return {
    id: record._id.toString(),
    name: record.name,
    value: record.value,
    createdAt: record.createdAt,
  };
}

// -----------------------------
// 🔍 SEARCH
// -----------------------------
async function searchRecords(keyword) {
  const regex = new RegExp(keyword, "i");

  const results = await collection
    .find({
      $or: [{ name: regex }, { value: regex }],
    })
    .toArray();

  return results.map((r) => ({
    id: r._id.toString(),
    name: r.name,
    value: r.value,
    createdAt: r.createdAt,
  }));
}

// -----------------------------
// ↕️ SORT (in-memory sort only)
// -----------------------------
async function sortRecords(field, order) {
  const records = await listRecords();

  return records.sort((a, b) => {
    let x = a[field];
    let y = b[field];

    if (field === "createdAt") {
      x = new Date(x).getTime();
      y = new Date(y).getTime();
    }

    if (typeof x === "string") x = x.toLowerCase();
    if (typeof y === "string") y = y.toLowerCase();

    if (order === "asc") return x > y ? 1 : -1;
    else return x < y ? 1 : -1;
  });
}

// -----------------------------
// 📊 VAULT STATISTICS
// -----------------------------
async function getVaultStatistics() {
  const records = await listRecords();
  if (records.length === 0) {
    return "No records found in vault.";
  }

  const totalRecords = records.length;

  // Longest name
  let longest = records.reduce((a, b) =>
    a.name.length > b.name.length ? a : b
  );

  // Valid creation dates
  const validDates = records
    .map((r) => new Date(r.createdAt))
    .filter((d) => !isNaN(d.getTime()));

  let earliest = "N/A";
  let latest = "N/A";

  if (validDates.length > 0) {
    earliest = new Date(Math.min(...validDates))
      .toISOString()
      .split("T")[0];
    latest = new Date(Math.max(...validDates))
      .toISOString()
      .split("T")[0];
  }

  return `
Vault Statistics:
-----------------------------
Total Records: ${totalRecords}
Longest Name: ${longest.name} (${longest.name.length} characters)
Earliest Record: ${earliest}
Latest Record: ${latest}
`;
}
async function closeDB() {
  if (client) await client.close();
  console.log("MongoDB connection closed.");
}
module.exports = {
  addRecord,
  listRecords,
  updateRecord,
  deleteRecord,
  searchRecords,
  sortRecords,
  getVaultStatistics,
  createBackup,
  closeDB,
};

