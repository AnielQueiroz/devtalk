import { Server } from "socket.io";
import http from "node:http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

// Usada para armazenar os onlines
const userSocketMap = {};

io.on("connection", (conn) => {
    console.log("Usuário conectado: ", conn.id);

    const userId = conn.handshake.query.userId;
    if (userId) userSocketMap[userId] = conn.id;

    // io.emit é usado para enviar eventos para todos os clientes conectados
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    
    conn.on("disconnect", () => {
        console.log("Usuário desconectado: ", conn.id);
        delete userSocketMap[userId];

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});


export { io, app, server};