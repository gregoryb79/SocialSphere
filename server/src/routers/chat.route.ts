import { Router } from "express";
import { dbClient } from "../models/db";

export const router = Router();

router.get("/messages/:chatId", async (req, res) => {
    const { chatId } = req.params;

    try {
        const result = await dbClient.execute({
            sql: `SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC`,
            args: [chatId]
        });

        res.json(result.rows);
    } catch (error) {
        console.error("Failed to fetch messages:", error);
        res.status(500).json({ error: "Failed to load messages" });
    }
});

router.get("/friends/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await dbClient.execute({
            sql: `SELECT u.id, u.username
            FROM friends f
            JOIN users u ON (u.id = f.user1_id OR u.id = f.user2_id)
            WHERE (f.user1_id = ? or f.user2_id = ?)
            AND u.id != ?`,
            args: [userId, userId, userId],
        });

        res.json(result.rows);
    } catch (error) {
        console.error("Failed to fetch friends:", error);
        res.status(500).json({ error: "Failed to load friends" });
    }
});

