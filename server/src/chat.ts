import { Server } from "socket.io";
import http from "http";
import { dbClient } from "./models/db";
import { randomUUID } from "crypto";

export function setupChatSocket(server: http.Server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("message", async (data) => {
            console.log("Message receivrd:", data);

            try { 
                await dbClient.execute({
                    sql: `INSERT INTO messages (id, chat_id, sender_id, receiver_id, text, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
                    args: [randomUUID(), data.chat_id, data.sender_id, data.receiver_id, data.text, new Date().toISOString()]
                });    
            } catch (error) {
                console.error("Failed to insert message:", error);
            }

            io.emit("message", data);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
}