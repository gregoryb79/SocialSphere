import express from 'express';
export const router = express.Router();
import { searchUsersByUsername, searchPostsByContent } from '../models/search';


router.get('/users', async (req, res) => {
    try {
        const searchTerm = req.query.q as string;
        console.log(`Fetching search: ${searchTerm}`);

        const users = await searchUsersByUsername(searchTerm);
        res.json(users);

    } catch (error: any) {

        console.error("Error searching users:", error);
        res.status(500).json({ message: "Failed to search users", error: error.message });
    }
});


router.get('/posts', async (req, res) => {

    try {
        const searchTerm = req.query.q as string;
        console.log(`Fetching posts for search term: ${searchTerm}`);

        const posts = await searchPostsByContent(searchTerm);
        res.json(posts); 

    } catch (error: any) {

        console.error("Error in /api/search/posts route:", error);
        res.status(500).json({ message: "Failed to search posts", error: error.message });
    }
});
