import { randomUUID } from "crypto";
import { dbClient } from "./db";
import { areFriends } from "./friends";

export type ChatMessage = {
    chat_id: string;
    sender_id: string;
    receiver_id: string;
    text: string;
};

export async function saveMessageToDb(message: ChatMessage) {
    const friends = await areFriends(message.sender_id, message.receiver_id);

    if (!friends) {
        throw new Error("Users are not friends. Message not saved.");
    }
    
    await dbClient.execute({
        sql: `INSERT INTO messages (id, chat_id, sender_id, receiver_id, text, created_at)
        VALUES (?, ?, ?, ?, ?, ?)`,
        args: [randomUUID(), message.chat_id, message.sender_id, message.receiver_id, message.text, new Date().toISOString(),],
    });
}
