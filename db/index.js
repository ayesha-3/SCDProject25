const fileDB = require('./file');
const recordUtils = require('./record');
const vaultEvents = require('../events');

function addRecord({ name, value }) {
  recordUtils.validateRecord({ name, value });
  const data = fileDB.readDB();
  const newRecord = { id: recordUtils.generateId(), name, value };
  data.push(newRecord);
  fileDB.writeDB(data);
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

module.exports = { addRecord, listRecords, updateRecord, deleteRecord, searchRecords, sortRecords };
