import { Server } from "socket.io";
import http from "http";
import { dbClient } from "../models/db";
import { randomUUID } from "crypto";
import { saveMessageToDb } from "../models/chat";

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
            console.log("Message received:", data);

            try { 
                await saveMessageToDb(data);
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