const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const GameRound = require('../models/GameRound');
const Transaction = require('../models/Transaction');

// @desc Place a bet
// @route POST /api/bet
router.post('/', async (req, res) => {
  const { playerId, amount, currency } = req.body;

  try {
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    // Check sufficient balance
    if (!player.wallet[currency] || player.wallet[currency] < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct amount
    player.wallet[currency] -= amount;

    // Create transaction
    const tx = new Transaction({
      playerId,
      amount: -amount,
      currency,
      type: 'BET',
      timestamp: new Date(),
    });

    // Create game round entry
    const game = new GameRound({
      playerId,
      betAmount: amount,
      currency,
      status: 'ONGOING',
      betTime: new Date(),
    });

    await player.save();
    await tx.save();
    await game.save();

    res.json({ message: 'Bet placed successfully', gameId: game._id });
  } catch (err) {
    console.error('Bet Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
