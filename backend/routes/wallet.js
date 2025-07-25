const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// @desc Get player wallet by ID
// @route GET /api/wallet/:playerId
router.get('/:playerId', async (req, res) => {
  try {
    const player = await Player.findById(req.params.playerId);
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player.wallet);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc Update wallet (manual top-up)
// @route POST /api/wallet/:playerId
router.post('/:playerId', async (req, res) => {
  const { btc, eth } = req.body;
  try {
    const player = await Player.findById(req.params.playerId);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    if (btc) player.wallet.btc += btc;
    if (eth) player.wallet.eth += eth;

    await player.save();
    res.json(player.wallet);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
