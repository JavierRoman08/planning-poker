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
  console.log("a user connected", socket.id);

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
      cards: generateCardPool(),
      adminID: socket.id
    };
    
    socket.emit("gameCreated", { gameId, gameName: games[gameId].name });

    console.log(`Game created: ${data.gameName} with ID ${gameId}`);
  });

  socket.on("resetGame", (gameId) => {
    const game = games[gameId]

    game.cards = generateCardPool()
    game.votes = []

    io.to(gameId).emit("gameReseted", {cards: game.cards, votes: game.votes})
  })

  socket.on("joinRoom", (gameId, data) => {
    const game = games[gameId]

    if (game) {
      const isAdmin = socket.id === game.adminID;

      const player = { playerId: socket.id, nickname: data.nickname, role: data.role, isAdmin: isAdmin };
      game.players.push(player);

      socket.join(gameId);

      socket.emit("getCardPool", { cards: game.cards });
      socket.emit("getPlayerInfo", {player})
      io.to(gameId).emit("getVotes", {votes: game.votes})

      io.to(gameId).emit("joinedRoom", {gameName: game.name, players: game.players, alert: `${player.nickname} has joined`, player});

    } else {
      socket.emit("error", { message: "Game not found" });
    }
  })

  socket.on("selectCard", (gameId, player, voteValue) => {
    const game = games[gameId]

    game.votes.push({player, voteValue})

    if(game) {
      io.to(gameId).emit("selectedCard", {message: `${player.nickname} has choosen a card`, votes: game.votes})
    } else {
      socket.emit("error", { message: "An error has ocurred" });
    }

  })

  socket.on('changeRole', (gameId, playerRole) => {
    const game = games[gameId];
    if (game) {
      const player = game.players.find((p) => p.playerId === socket.id);
      if (player) {
        player.role = playerRole 
      }
      io.to(gameId).emit('roleChanged', { player });
    }
  });

  socket.on('selectAdmin', (gameId, newAdmin) => {
    const game = games[gameId];
    if (game) {
      const player = game.players.find((p) => p.playerId === newAdmin.playerId);
      if (player) {
        player.isAdmin = true 
      }
      io.to(gameId).emit('adminSelected', { player, players: game.players });
    }
  });

  socket.on('cardVisibility', (data) => {
    console.log('Card visibility data received:', data);
    io.emit('cardVisibility', data);
  });

  socket.on("disconnect", () => {
    console.log('player disconnected', socket.id)
    for (const gameId in games) {
      const game = games[gameId];
      const playerIndex = game.players.findIndex((p) => p.playerId === socket.id);
      if (playerIndex !== -1) {
        game.players.splice(playerIndex, 1); // Eliminar al jugador de la lista
        io.to(gameId).emit('userListUpdated', {players: game.players}); // Notificar a todos en la sala
        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

const generateCardPool = () => {
  const numbers = [];
  while (numbers.length < 8) {
    const randomNumber = Math.floor(Math.random() * 16); // Genera un número aleatorio entre 0 y 15
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber); // Añade el número si no está en el array
    }
  }

  return numbers;
}