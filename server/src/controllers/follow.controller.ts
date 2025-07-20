import { Request, Response } from "express";
import { dbClient } from "../models/db";

export const getFollowers = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await dbClient.execute({
      sql: `
        SELECT users.id, users.username, users.avatar 
        FROM user_followers 
        JOIN users ON user_followers.follower_id = users.id
        WHERE user_followers.following_id = ?
      `,
      args: [id],
    });
    res.json({ followers: result.rows });
  } catch (err) {
    console.error("Failed to fetch followers:", err);
    res.status(500).json({ error: "Failed to fetch followers" });
  }
};

export const getFollowing = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await dbClient.execute({
      sql: `
        SELECT users.id, users.username, users.avatar 
        FROM user_followers 
        JOIN users ON user_followers.following_id = users.id
        WHERE user_followers.follower_id = ?
      `,
      args: [id],
    });
    res.json({ following: result.rows });
  } catch (err) {
    console.error("Failed to fetch following:", err);
    res.status(500).json({ error: "Failed to fetch following" });
  }
};
