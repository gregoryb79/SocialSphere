import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { followUser, unfollowUser } from "../controllers/user.controller";

export const router = express.Router();
import { dbClient } from "../models/db";
import { getUserById } from '../models/user';

router.get("/", async (_, res) => {
    res.status(200).json({
        message: "Welcome to the SocialSphere users API",});
});

<<<<<<< HEAD
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log(`Fetching profile for user: ${userId}`);

  try {
    const userProfile = await getUserById(userId);
    res.json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});
=======
router.post("/:id/follow", authenticate, followUser);
router.post("/:id/unfollow", authenticate, unfollowUser);
>>>>>>> 591b424023f56ea7ffede8befa599501a9b18375
