import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { followUser, unfollowUser } from "../controllers/user.controller";
import { deleteUser, getUserById} from "../models/user";
import type {User} from "../models/user"
export const router = express.Router();
import { dbClient } from "../models/db";
import { getFollowers, getFollowing } from "../controllers/follow.controller";
import { updateUser } from "../controllers/auth.controller";



router.get("/:id/followers",authenticate, getFollowers);
router.get("/:id/following",authenticate, getFollowing);

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

router.post("/:id/follow", authenticate, followUser);
router.post("/:id/unfollow", authenticate, unfollowUser);

router.put("/:id", authenticate, async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const existingUser = await getUserById(req.params.id);
    if (!existingUser) {
      throw new Error('User not found');
    }
    const result = await updateUser(req);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete('/:userId', authenticate, async (req, res) => {
  console.log('DELETE request received');
  try {
    const { userId } = req.params;
    await deleteUser(userId);
    console.log('User deleted successfully');
    res.json({ message: 'Account deleted' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

