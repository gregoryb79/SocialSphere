import { Request, Response } from "express";
import { followUserQuery, unfollowUserQuery, isFollowing } from "../queries/follow.queries";
import { getUserById } from "../models/user";
import { AuthRequest } from "../middlewares/auth.middleware";

export const followUser = async (req: AuthRequest, res: Response) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user?.userId;

  if (targetUserId === currentUserId) {
    return res.status(400).json({ error: "You cannot follow yourself" });
  }

  const targetUser = await getUserById(targetUserId);
  if (!targetUser) {
    return res.status(404).json({ error: "Target user not found" });
  }

  const alreadyFollowing = await isFollowing(currentUserId, targetUserId);
  if (alreadyFollowing) {
    return res.status(400).json({ error: "Already following this user" });
  }

  await followUserQuery(currentUserId, targetUserId);
  res.status(200).json({ message: "Followed user" });
};

export const unfollowUser = async (req: AuthRequest, res: Response) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user?.userId;

  if (targetUserId === currentUserId) {
    return res.status(400).json({ error: "You cannot unfollow yourself" });
  }

  const targetUser = await getUserById(targetUserId);
  if (!targetUser) {
    return res.status(404).json({ error: "Target user not found" });
  }

  const alreadyFollowing = await isFollowing(currentUserId, targetUserId);
  if (!alreadyFollowing) {
    return res.status(400).json({ error: "You are not following this user" });
  }

  await unfollowUserQuery(currentUserId, targetUserId);
  res.status(200).json({ message: "Unfollowed user" });
};
