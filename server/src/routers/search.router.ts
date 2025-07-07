import express from 'express';
export const router = express.Router();
import { dbClient } from "../models/db";
import { searchUsersByUsername, searchPostsByContent } from '../models/search';

router.get('/users', async (req, res) => {
    const searchTerm = req.query.q as string;
    console.log(`Fetching search: ${searchTerm}`);
    let users: any[] = [];

    try {
        users = await searchUsersByUsername(searchTerm);
        return res.json(users);
    } catch (error: any) {
        console.error("Error searching users:", error);
        return res.status(500).json({ message: "Failed to search users", error: error.message });
    }
});

router.get('/posts', async (req, res) => {
    const searchTerm = req.query.q as string;
    console.log(`Fetching posts for search term: ${searchTerm}`);

    if (!searchTerm) {
        return res.json([]);
    }

    try {
        const posts = await searchPostsByContent(searchTerm);
        res.json(posts); // Send the array of matching posts
    } catch (error: any) {
        console.error("Error in /api/search/posts route:", error);
        res.status(500).json({ message: "Failed to search posts", error: error.message });
    }
});
