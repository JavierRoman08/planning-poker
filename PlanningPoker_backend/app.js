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
    origin: "http://localhost:4200", // Cambia esto a la URL de tu aplicación Angular
    methods: ["GET", "POST"]
  }
});

// Objeto para almacenar las partidas
const games = {};

// Manejar la conexión de un cliente
io.on("connection", (socket) => {
  console.log("a user connected", socket);

  // Crear una nueva partida
  socket.on("createRoom", (data) => {
    const gameId = Math.random().toString(36).substring(2, 9); // ID único para la partida
    games[gameId] = {
      name: data.gameName,
      votes: [],
      players: [],
    };

    socket.join(gameId); // El usuario se une a la partida creada
    socket.emit("gameCreated", { gameId, gameName: data.gameName });
    console.log(`Game created: ${data.gameName} with ID ${gameId}`);
  });

  // Unirse a una sala (partida)
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    games[roomId].players.push(socket.id); // Añadir el usuario a la lista de jugadores
    console.log(`User joined room: ${roomId}`);
  });

  // Manejar el voto de un usuario
  socket.on("vote", (vote) => {
    const room = Object.keys(socket.rooms)[1]; // Obtener el ID de la sala
    games[room].votes.push(vote);
    io.to(room).emit("newVote", vote); // Emitir el voto a todos los usuarios en la sala
  });

  // Manejar la desconexión de un cliente
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Iniciar el servidor en el puerto 3000
server.listen(3000, () => {
  console.log("listening on *:3000");
});
