import express from 'express';
export const router = express.Router();
import { dbClient } from "../models/db";


router.get('/', async (req, res) => {
    try {
        const result = await dbClient.execute("SELECT * FROM comments ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
});