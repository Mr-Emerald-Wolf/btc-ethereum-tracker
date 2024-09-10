const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
  blockNumber: Number,
  blockTimestamp: Date,
  fee: Number,
  hash: String,
  pubkey: String,
});

module.exports = mongoose.model('Deposit', depositSchema);