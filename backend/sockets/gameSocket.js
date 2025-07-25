const GameRound = require('../models/GameRound');
const Player = require('../models/Player');
const Transaction = require('../models/Transaction');

let crashMultiplier = 1.00;
let isCrashed = false;
let interval = null;

function startCrashGame(io) {
  io.on('connection', (socket) => {
    console.log('🟢 New client connected:', socket.id);

    // Start game simulation on connection (for demo purposes)
    socket.on('join_game', ({ playerId }) => {
      console.log(`Player ${playerId} joined`);
      socket.emit('game_starting', { message: 'Game will start in 5s' });

      setTimeout(() => {
        simulateGame(socket, playerId);
      }, 5000);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Client disconnected:', socket.id);
    });
  });
}

function simulateGame(socket, playerId) {
  crashMultiplier = 1.00;
  isCrashed = false;

  interval = setInterval(() => {
    crashMultiplier += Math.random() * 0.1; // simulate growth
    socket.emit('multiplier_update', crashMultiplier.toFixed(2));

    if (Math.random() < 0.01 || crashMultiplier > 5) {
      isCrashed = true;
      clearInterval(interval);
      socket.emit('game_crashed', { crashAt: crashMultiplier.toFixed(2) });

      // Save game round in DB (optional)
      const game = new GameRound({
        playerId,
        crashPoint: crashMultiplier,
        status: 'CRASHED',
        currency: 'USDT',
        betAmount: 10,
      });

      game.save();
    }
  }, 100); // update every 100ms
}

module.exports = startCrashGame;
