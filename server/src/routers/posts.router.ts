import express from 'express';
export const router = express.Router();
import { dbClient } from "../models/db";
import { updatePost } from "../controllers/post.controller";
import { authenticate } from "../middlewares/auth.middleware";

router.put("/:id", authenticate, updatePost);
   
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log(`Fetching posts for user: ${userId}`);

    if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
    }

    if (userId === "guest" || userId === "Guest") {
        try {
            const allPostsResult = await dbClient.execute({
                sql: `SELECT c.id, c.author_id, c.content, c.image, c.created_at, c.updated_at,
                            u.username as author_name
                    FROM comments c
                    INNER JOIN users u ON c.author_id = u.id
                    WHERE c.parent_id IS NULL
                    ORDER BY c.created_at DESC`,
                args: []
            });

            const posts = allPostsResult.rows;
            const postIds = posts.map(post => post.id as string);
            console.log(`Found ${postIds} posts for guest user`);

            if (postIds.length === 0) {
                res.json([]);
                return;
            }
            const combinedPosts = await fetchAndCombinePosts(postIds, posts);

            res.json(combinedPosts);
        } catch (error) {
            console.error("Error fetching all posts:", error);
            res.status(500).json({ error: "Failed to fetch all posts" });
        }
    } else{
        try {
            const postsResult = await dbClient.execute({
                sql: `SELECT c.id, c.author_id, c.content, c.image, c.created_at, c.updated_at,
                 u.username as author_name
                FROM comments c
                INNER JOIN users u ON c.author_id = u.id
                WHERE c.author_id IN (
                    SELECT following_id 
                    FROM user_following 
                    WHERE user_id = ?
                )
                AND c.parent_id IS NULL
                ORDER BY c.created_at DESC`,
                args: [userId]
            });

            const posts = postsResult.rows;
            const postIds = posts.map(post => post.id as string);
            console.log(`Found ${postIds} posts for user ${userId}`);

            if (postIds.length === 0) {
                console.log("No posts found for user:", userId);
                res.json([]);
                return;
            }
            const combinedPosts = await fetchAndCombinePosts(postIds, posts);   

            res.json(combinedPosts);
        } catch (error) {
            console.error("Error fetching posts:", error);
            res.status(500).json({ error: "Failed to fetch posts" });
        }
    }
    
});

async function fetchAndCombinePosts(postIds: string[], posts: any[]) {
    const placeholders = postIds.map(() => '?').join(',');
    console.log(`Fetching likes and comments for posts: ${postIds}`);

    const likesResult = await dbClient.execute({
        sql: `SELECT comment_id, user_id 
            FROM comment_likes 
            WHERE comment_id IN (${placeholders})`,
        args: postIds
    });
    console.log(`Found like results:`,likesResult);
            
    const commentsResult = await dbClient.execute({
        sql: `SELECT parent_id, id as comment_id
            FROM comments 
            WHERE parent_id IN (${placeholders})`,
        args: postIds
    });
    console.log(`Found comment results:`,commentsResult);

            
    return posts.map(post => {
        const postLikes = likesResult.rows
            .filter(like => like.comment_id === post.id)
            .map(like => like.user_id);

        const postComments = commentsResult.rows
            .filter(comment => comment.parent_id === post.id)
            .map(comment => comment.comment_id);

        console.log(`Post ${post.id} has ${postLikes.length} likes and ${postComments.length} comments`);

        return {
            _id: post.id,
            author: post.author_id,
            authorName: post.author_name,
            content: post.content,
            image: post.image,
            likes: postLikes,
            comments: postComments,
            createdAt: post.created_at,
            updatedAt: post.updated_at
        };});    
}

export default router;