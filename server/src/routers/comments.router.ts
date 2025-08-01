import express from 'express';
export const router = express.Router();
import { dbClient } from "../models/db";
import { randomUUID } from 'crypto';
import { authenticate, AuthRequest } from '../middlewares/auth.middleware';


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
                  WHERE c.id IN (${placeholders})
                  ORDER BY c.created_at DESC`,
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
        console.log(`Found children comments results:`,childrenCommentsResult);

        const combinedComments = comments.map(comment => {
            const commentLikes = likesResult.rows
                .filter(like => like.comment_id === comment.id)
                .map(like => like.user_id);

            const commentComments = childrenCommentsResult.rows
                .filter(childComment => childComment.parent_id === comment.id)
                .map(childComment => childComment.comment_id);

            console.log(`Comment ${comment.id} has ${commentLikes.length} likes and ${commentComments.length} comments`);

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

router.post('/',authenticate, async (req, res) => {
    const { content, parentId, avatarURL } = req.body;    
    const authorId = (req as AuthRequest).user?.userId;     

    console.log(`Posting comment by user ${authorId} with content: ${content}, parentId: ${parentId}, avatarURL: ${avatarURL}`);

    if (!authorId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    if (!content || content.trim() === "") {
        res.status(400).json({ error: "Content cannot be empty" });
        return;
    }

    const newCommentId = parentId ? `c-${randomUUID()}` : `p-${randomUUID()}`; 
    const newComment = {
        id: newCommentId,
        author_id: authorId,
        content: content,
        parent_id: parentId ? parentId : null,
        image: avatarURL || null, 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }

    try {
        const result = await dbClient.execute({
            sql: `INSERT INTO comments (id, author_id, parent_id, content, image, created_at, updated_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            args: [newComment.id, newComment.author_id, newComment.parent_id, newComment.content, newComment.image, newComment.created_at, newComment.updated_at]
        });        

        if (result.rowsAffected === 1) {
            res.status(201).json({id: newCommentId});
            console.log(`Comment created successfully with ID: ${newCommentId}`);
        } else {
            res.status(500).json({ error: "Failed to create comment" });
        };
    } catch (error) {
        console.error("Error posting comment:", error);
        res.status(500).json({ error: "Failed to post comment" });
    }
});

router.put('/',authenticate, async (req, res) => {
    const { content, commentId, avatarURL } = req.body;    
    const authorId = (req as AuthRequest).user?.userId;     

    console.log(`Editing comment ${commentId} by user ${authorId} with content: ${content}.`);

    if (!authorId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    if (!content || content.trim() === "") {
        res.status(400).json({ error: "Content cannot be empty" });
        return;
    }
    
    
    try {
        const existingCommentResult = await dbClient.execute({
            sql: `SELECT * FROM comments WHERE id = ? AND author_id = ?`,
            args: [commentId, authorId]
        });
        if (existingCommentResult.rows.length === 0) {
            res.status(404).json({ error: "Comment not found or unauthorized" });
            return;
        }
        const isPost = existingCommentResult.rows[0].parent_id === null;
        const result = await dbClient.execute({
            sql: `UPDATE comments SET content = ?, updated_at = ? WHERE id = ?`,
            args: [content, new Date().toISOString() ,commentId]
        });  
        if (isPost && avatarURL) {
            await dbClient.execute({
                sql: `UPDATE comments SET image = ? WHERE id = ?`,
                args: [avatarURL, commentId]
            });
        }
              

        if (result.rowsAffected === 1) {
            res.status(201).json({id: commentId});
            console.log(`Comment ${commentId} updated successfully.`);
        } else {
            res.status(500).json({ error: "Failed to update comment" });
        };
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ error: "Failed to update comment" });
    }
});

router.post('/like',authenticate, async (req, res) => {
    const { postId, userId } = req.body; 
    const getLoggedInUserId = (req as AuthRequest).user?.userId; 
    console.log(`Liking post/comment ${postId} by user ${userId}.`);  

    if (userId !== getLoggedInUserId) {
        console.error(`User ID mismatch: ${userId} !== ${getLoggedInUserId}`);
        res.status(403).json({ error: "Identities do not match" });
        return; 
    }       
    if (!postId || !userId) {
        res.status(400).json({ error: "Post ID and User ID are required" });
        return;
    }

    try {
        const existingLikeResult = await dbClient.execute({
            sql: `SELECT * FROM comment_likes WHERE comment_id = ? AND user_id = ?`,
            args: [postId, userId]
        });

        if (existingLikeResult.rows.length > 0) {
            console.log(`User ${userId} already liked post/comment ${postId} - unliking ${postId}.`);
            const unlikeResult = await dbClient.execute({
                sql: `DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?`,
                args: [postId, userId]
            });
            if (unlikeResult.rowsAffected === 1) {                
                console.log(`Comment/post ${postId} unliked by user ${userId}.`);
            } else {
                res.status(500).json({ error: "Failed to unlike comment" });
            }          
            res.status(200).json({ message: "Comment unliked successfully" });
            return;
        } 

        console.log(`Adding like by ${userId} to post/comment ${postId}.`);
        const result = await dbClient.execute({
            sql: `INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)`,
            args: [postId, userId]
        }); 

        if (result.rowsAffected === 1) {
            console.log(`Comment ${postId} liked by user ${userId}.`);
            res.status(201).json({ message: "Comment liked successfully" });
        } else {
            res.status(500).json({ error: "Failed to like comment" });
        }
    
    } catch (error) {
        console.error("Error liking comment:", error);
        res.status(500).json({ error: "Failed to like/unlike comment" });
    }

});

router.delete('/:id', authenticate, async (req, res) => {
    const commentId = req.params.id;
    const authorId = (req as AuthRequest).user?.userId;

    console.log(`Deleting comment ${commentId} by user ${authorId} with its children`);

    if (!authorId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        await deleteChildren(commentId, authorId);
        const result = await dbClient.execute({
            sql: `DELETE FROM comments WHERE id = ? AND author_id = ?`,
            args: [commentId, authorId]
        });
        res.status(200).json({ message: "Comment and its children deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "Failed to delete comment" });
    }
});

async function deleteChildren (commentId: string, authorId: string) {
        
    try {
        const result = await dbClient.execute({
            sql: `SELECT id FROM comments WHERE parent_id = ? AND author_id = ?`,
            args: [commentId, authorId]
        });
        
        if (result.rows.length === 0) {

            const result = await dbClient.execute({
                sql: `DELETE FROM comments WHERE id = ? AND author_id = ?`,
                args: [commentId, authorId]
            });
            if (result.rowsAffected = 1) {
                console.log(`Comment with ID ${commentId} of user ${authorId} is "DELETED"`);
            } 
            const likeResult = await dbClient.execute({
                sql: `DELETE FROM comment_likes WHERE comment_id = ?`,
                args: [commentId]
            });
            console.log(`${likeResult.rowsAffected} likes for comment with ID ${commentId} are "DELETED"`);

            return;
        }else{
            const childIds = result.rows.map(row => row.id) as string[];
            
            for (const childId of childIds) {                
                await deleteChildren(childId, authorId);                
            }
            return;
        }        
    } catch (error) {
        console.error("Error deleting child comments:", error);
    }
}