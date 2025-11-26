const fs = require('fs');
const path = require('path');

const fileDB = require('./file');
const recordUtils = require('./record');
const vaultEvents = require('../events');

const backupsDir = path.join(__dirname, '..', 'backups');
// Ensure backups folder exists
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir);
}

function createBackup() {
  const data = fileDB.readDB();
  const timestamp = new Date()
    .toISOString()
    .replace(/:/g, '-')
    .replace(/\..+/, '');

  const fileName = `backup_${timestamp}.json`;
  const filePath = path.join(backupsDir, fileName);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log(`📦 Backup created successfully: ${fileName}`);
}
function addRecord({ name, value }) {
  recordUtils.validateRecord({ name, value });
  const data = fileDB.readDB();
  const newRecord = { id: recordUtils.generateId(), name, value, createdAt: new Date().toISOString() };
  data.push(newRecord);
  fileDB.writeDB(data);
  createBackup(); 
  vaultEvents.emit('record Added', newRecord);
  return newRecord;
}

function listRecords() {
  return fileDB.readDB();
}

function updateRecord(id, newName, newValue) {
  const data = fileDB.readDB();
  const record = data.find(r => r.id === id);
  if (!record) return null;
  record.name = newName;
  record.value = newValue;
  fileDB.writeDB(data);
  vaultEvents.emit('recordUpdated', record);
  return record;
}

function deleteRecord(id) {
  let data = fileDB.readDB();
  const record = data.find(r => r.id === id);
  if (!record) return null;
  data = data.filter(r => r.id !== id);
  fileDB.writeDB(data);
  createBackup(); 
  vaultEvents.emit('recordDeleted', record);
  return record;
}

//search feature
function searchRecords(keyword) {
  const db = fileDB.readDB();
  keyword = keyword.toLowerCase();

  return db.filter(
    r => r.name.toLowerCase().includes(keyword) || r.id.toString() === keyword
  );
}
function sortRecords(field, order) {
  const db = fileDB.readDB();
  const sorted = [...db]; // clone array so vault is not modified

  sorted.sort((a, b) => {
    let f1 = a[field];
    let f2 = b[field];

    // Convert dates to timestamps when sorting by created date
    if (field === 'created') {
      f1 = new Date(a.created).getTime();
      f2 = new Date(b.created).getTime();
    }

    if (typeof f1 === 'string') f1 = f1.toLowerCase();
    if (typeof f2 === 'string') f2 = f2.toLowerCase();

    if (order === 'asc') return f1 > f2 ? 1 : -1;
    else return f1 < f2 ? 1 : -1;
  });

  return sorted;
}
function getVaultStatistics() {
    const records = fileDB.readDB(); // load data from vault JSON

    if (!records || records.length === 0) {
        return "No records found in vault.";
    }

    const totalRecords = records.length;

    // Last modified date of vault.json
    const vaultPath = path.join(__dirname, '..', 'data', 'vault.json');
    const stats = fs.statSync(vaultPath);
    const lastModified = stats.mtime.toISOString().replace('T', ' ').split('.')[0];

    // Longest name
    let longest = records.reduce((a, b) =>
        a.name.length > b.name.length ? a : b
    );

    // Filter dates that are valid
    const validDates = records
        .map(r => new Date(r.createdAt))
        .filter(d => !isNaN(d.getTime()));   // only valid dates

    // If no valid dates exist (bad data)
    if (validDates.length === 0) {
        return `
Vault Statistics:
-----------------------------
Total Records: ${totalRecords}
Last Modified: ${lastModified}
Longest Name: ${longest.name} (${longest.name.length} characters)
Earliest Record: N/A
Latest Record: N/A
`;
    }

    const earliest = new Date(Math.min(...validDates)).toISOString().split('T')[0];
    const latest = new Date(Math.max(...validDates)).toISOString().split('T')[0];

    return `
Vault Statistics:
-----------------------------
Total Records: ${totalRecords}
Last Modified: ${lastModified}
Longest Name: ${longest.name} (${longest.name.length} characters)
Earliest Record: ${earliest}
Latest Record: ${latest}
`;
}


module.exports = { addRecord, listRecords, updateRecord, deleteRecord, searchRecords, sortRecords, createBackup , getVaultStatistics };
