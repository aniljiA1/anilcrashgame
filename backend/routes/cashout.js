const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const GameRound = require('../models/GameRound');
const Transaction = require('../models/Transaction');

// @desc Cash out from the crash game
// @route POST /api/cashout
router.post('/', async (req, res) => {
  const { playerId, gameId, cashoutMultiplier } = req.body;

  try {
    const game = await GameRound.findById(gameId);
    if (!game || game.status !== 'ONGOING') {
      return res.status(400).json({ error: 'Invalid or completed game round' });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const winnings = game.betAmount * cashoutMultiplier;

    // Update player's wallet
    player.wallet[game.currency] = (player.wallet[game.currency] || 0) + winnings;

    // Record transaction
    const tx = new Transaction({
      playerId,
      amount: winnings,
      currency: game.currency,
      type: 'CASHOUT',
      timestamp: new Date(),
    });

    // Update game round
    game.cashoutMultiplier = cashoutMultiplier;
    game.status = 'CASHED_OUT';
    game.cashoutTime = new Date();

    await player.save();
    await tx.save();
    await game.save();

    res.json({ message: 'Cashout successful', winnings });
  } catch (err) {
    console.error('Cashout Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
