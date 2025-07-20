import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { followUser, unfollowUser } from "../controllers/user.controller";
import { deleteUser, updateUser, getUserById } from "../models/user";
export const router = express.Router();
import { dbClient } from "../models/db";

router.get("/", async (_, res) => {
    res.status(200).json({
        message: "Welcome to the SocialSphere users API",});
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log(`Fetching profile for user: ${userId}`);

  try {
    const userProfile = await getUserById(userId);
    res.json(userProfile ?? { error: 'User not found', status: 404 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await deleteUser(userId);
    res.json({ message: 'Account deleted' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

router.post("/:id/follow", authenticate, followUser);
router.post("/:id/unfollow", authenticate, unfollowUser);


router.put("/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const fields = req.body;
    await updateUser(userId, fields);
    res.json({ message: 'User updated' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});


