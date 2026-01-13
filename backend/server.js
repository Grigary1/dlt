import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const games = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    if (!games[roomId]) {
      games[roomId] = {
        board: Array(9).fill(null),
        turn: "X",
        players: [],
      };
    }

    const game = games[roomId];

    if (game.players.length < 2) {
      game.players.push(socket.id);
    }

    socket.emit("init", game);
    io.to(roomId).emit("update", game);
  });

  socket.on("move", ({ roomId, index }) => {
    const game = games[roomId];
    if (!game) return;

    if (game.board[index] !== null) return;

    game.board[index] = game.turn;
    game.turn = game.turn === "X" ? "O" : "X";

    io.to(roomId).emit("update", game);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
