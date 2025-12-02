const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  id: Number,
  name: String,
  value: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Record", recordSchema);

