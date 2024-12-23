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

io.on("connection", (conn) => {
    console.log("Usuário conectado: ", conn.id);
});

io.on("disconnection", (conn) => {
    console.log("Usuário desconectado: ", conn.id);
});

export { io, app, server};