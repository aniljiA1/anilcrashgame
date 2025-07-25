const mongoose = require('mongoose');

const gameRoundSchema = new mongoose.Schema({
  roundNumber: Number,
  crashPoint: Number,
  bets: [{
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    usdAmount: Number,
    cryptoAmount: Number,
    currency: String,
    priceAtTime: Number,
    cashoutMultiplier: Number,
    cashedOut: Boolean,
  }],
  startedAt: Date,
  endedAt: Date,
});

module.exports = mongoose.model('GameRound', gameRoundSchema);
