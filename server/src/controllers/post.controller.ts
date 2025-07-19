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
