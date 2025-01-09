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

io.on("connection", (socket) => {
    console.log("⚡ Usuário conectado: ", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap.set(userId, socket.id);
        console.log(`📝 Usuário registrado: ${userId} -> SocketId: ${socket.id}`);
    } else {
        console.log("🚫 userId ausente no handshake.query");
    }

    // io.emit é usado para enviar eventos para todos os clientes conectados
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    
    socket.on("joinCommunity", (communityId) => {
        const room = `communityId_${communityId}`;	
        if (!socket.rooms.has(room)) {
            socket.join(room);
            console.log(`👥 Usuário ${userId} entrou na comunidade ${communityId}`);
        } else {
            console.log(`🚫 Usuário ${userId} ja esta na comunidade ${communityId}`);
        }
    });

    socket.on("disconnect", () => {
        console.log("🔌 Usuário desconectado: ", socket.id);
        for (const [key, value] of userSocketMap.entries()) {
            if (value === socket.id) {
                userSocketMap.delete(key);
                console.log(`🗑️ Usuário removido: ${key}`);
                break;
            }
        }

        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    });
});


export { io, app, server};