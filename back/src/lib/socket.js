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

export function getReceiverSocketId(userId) {
    return userSocketMap.get(userId);
}

// Usada para armazenar os onlines
const userSocketMap = new Map();

io.on("connection", (conn) => {
    console.log("⚡ Usuário conectado: ", conn.id);

    const userId = conn.handshake.query.userId;
    if (userId) {
        userSocketMap.set(userId, conn.id);
        console.log(`📝 Usuário registrado: ${userId} -> SocketId: ${conn.id}`);
    } else {
        console.log("🚫 userId ausente no handshake.query");
    }

    // io.emit é usado para enviar eventos para todos os clientes conectados
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    
    conn.on("disconnect", () => {
        console.log("🔌 Usuário desconectado: ", conn.id);
        for (const [key, value] of userSocketMap.entries()) {
            if (value === conn.id) {
                userSocketMap.delete(key);
                console.log(`🗑️ Usuário removido: ${key}`);
                break;
            }
        }

        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    });
});


export { io, app, server};