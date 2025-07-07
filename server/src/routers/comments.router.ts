import express from 'express';
export const router = express.Router();
import { dbClient } from "../models/db";


router.get('/', async (req, res) => {
    
    const ids = req.query.ids as string;

    console.log(`Fetching comments for IDs: ${ids}`);

    if (!ids || ids.length === 0) {
        res.status(400).json({ error: "No comment IDs provided" });
        return;
    }    

    try {
        const commentsIds = ids.split(",");
        const placeholders = commentsIds.map(() => '?').join(',');
        const commentsResult = await dbClient.execute({
            sql: `SELECT c.id, c.author_id, c.content, c.image, c.created_at, c.updated_at, c.parent_id,
                        u.username as author_name
                  FROM comments c
                  INNER JOIN users u ON c.author_id = u.id
                  WHERE c.id IN (${placeholders})`,
            args: commentsIds  
        });

        const comments = commentsResult.rows;
        if (comments.length === 0) {
            res.json([]);
            return;
        }

        const likesResult = await dbClient.execute({
        sql: `SELECT comment_id, user_id 
            FROM comment_likes 
            WHERE comment_id IN (${placeholders})`,
        args: commentsIds
        });
        console.log(`Found like results:`,likesResult);

        const childrenCommentsResult = await dbClient.execute({
        sql: `SELECT parent_id, id as comment_id
            FROM comments 
            WHERE parent_id IN (${placeholders})`,
        args: commentsIds
        });
        console.log(`Found comment results:`,childrenCommentsResult);

        const combinedComments = comments.map(comment => {
            const commentLikes = likesResult.rows
                .filter(like => like.comment_id === comment.id)
                .map(like => like.user_id);

            const commentComments = childrenCommentsResult.rows
                .filter(comment => comment.parent_id === comment.id)
                .map(comment => comment.comment_id);

            console.log(`Post ${comment.id} has ${commentLikes.length} likes and ${commentComments.length} comments`);

            return {
                _id: comment.id,
                author: comment.author_id,
                authorName: comment.author_name,
                parentId: comment.parent_id,
                content: comment.content,
                image: comment.image,
                likes: commentLikes,
                comments: commentComments,
                createdAt: comment.created_at,
                updatedAt: comment.updated_at
        };});    
        
        res.json(combinedComments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
});
