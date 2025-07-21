import { Request, Response } from "express";
import { followUserQuery, unfollowUserQuery, isFollowing } from "../queries/follow.queries";
import { getUserById } from "../models/user";
import { AuthRequest } from "../middlewares/auth.middleware";

export const followUser = async (req: AuthRequest, res: Response) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user?.userId;

  if (!currentUserId || !targetUserId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (targetUserId === currentUserId) {
    res.status(400).json({ error: "You cannot follow yourself" });
    return;
  }

  const targetUser = await getUserById(targetUserId);
  if (!targetUser) {
     res.status(404).json({ error: "Target user not found" });
     return;
  }

  const alreadyFollowing = await isFollowing(currentUserId, targetUserId);
  if (alreadyFollowing) {
    res.status(400).json({ error: "Already following this user" });
    return;
  }

  await followUserQuery(currentUserId, targetUserId);
  res.status(200).json({ message: "Followed user" });
};

export const unfollowUser = async (req: AuthRequest, res: Response) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user?.userId;

  if (targetUserId === currentUserId) {
    res.status(400).json({ error: "You cannot unfollow yourself" });
    return;
  }

  const targetUser = await getUserById(targetUserId);
  if (!targetUser) {
    res.status(404).json({ error: "Target user not found" });
    return;
  }

  const alreadyFollowing = await isFollowing(currentUserId as string, targetUserId);
  if (!alreadyFollowing) {
    res.status(400).json({ error: "You are not following this user" });
    return;
  }

  if (!currentUserId || !targetUserId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  await unfollowUserQuery(currentUserId as string, targetUserId);
  res.status(200).json({ message: "Unfollowed user" });
};
