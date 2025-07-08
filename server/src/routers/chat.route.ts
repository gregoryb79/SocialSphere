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
