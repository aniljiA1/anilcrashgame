const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: String,
  wallet: {
    btc: { type: Number, default: 0 },
    eth: { type: Number, default: 0 },
  },
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
