const express = require("express");
const cors = require('cors')
const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

const games = {};

io.on("connection", (socket) => {
  console.log("a user connected");

  // Crear nueva sala
  socket.on("createRoom", (data) => {

    if (!data.gameName || data.gameName.trim() === '') {
      socket.emit("error", { message: "Game name is required." });
      return;
    }

    const gameId = Math.random().toString(36).substring(2, 9);

    games[gameId] = {
      name: data.gameName,
      votes: [],
      players: [],
    };

    socket.join(gameId); 
    
    socket.emit("gameCreated", { gameId, gameName: data.gameName });

    console.log(`Game created: ${data.gameName} with ID ${gameId}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
