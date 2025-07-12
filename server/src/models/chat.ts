import { randomUUID } from "crypto";
import { dbClient } from "./db";

export type ChatMessage = {
    chat_id: string;
    sender_id: string;
    receiver_id: string;
    text: string;
};

export async function saveMessageToDb(message: ChatMessage) {
    await dbClient.execute({
        sql: `INSERT INTO messages (id, chat_id, sender_id, receiver_id, text, created_at)
        VALUES (?, ?, ?, ?, ?, ?)`,
        args: [randomUUID(), message.chat_id, message.sender_id, message.receiver_id, message.text, new Date().toISOString(),],
    });
}
