import { Request, Response } from "express";
import { createPost } from "../queries/post.queries";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createPostController = async (req: AuthRequest, res: Response) => {
  try {
    const { content, image } = req.body;
    const userId = req.user?.userId;

    if (!content || !userId) {
      return res.status(400).json({ error: "Missing content or user" });
    }

    const post = await createPost(userId, content, image);
    res.status(201).json(post);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Server error" });
  }
};
import { Request, Response } from "express";
import { dbClient } from "../models/db";
import { AuthRequest } from "../middlewares/auth.middleware";

export const updatePost = async (req: AuthRequest, res: Response) => {
  const postId = req.params.id;
  const userId = req.user?.userId;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content cannot be empty" });
  }

  try {
    const result = await dbClient.execute({
      sql: `
        UPDATE posts
        SET content = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND author_id = ?
      `,
      args: [content, postId, userId],
    });

    if (result.rowsAffected === 0) {
      return res.status(403).json({ error: "Unauthorized or post not found" });
    }

    res.status(200).json({ message: "Post updated" });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
