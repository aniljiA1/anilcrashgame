const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
dotenv.config();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
//mongoose.connect(process.env.MONGO_URI, {
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
//});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Models
const Player = require("./models/Player");
const Transaction = require("./models/Transaction");
const GameRound = require("./models/GameRound");

// Routes
app.use("/api/wallet", require("./routes/wallet"));
app.use("/api/bet", require("./routes/bet"));
app.use("/api/cashout", require("./routes/cashout"));

// Socket.IO Game Logic
require("./sockets/gameSocket")(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
