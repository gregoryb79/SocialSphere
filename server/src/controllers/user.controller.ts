import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Types } from "mongoose";
import { AuthRequest } from "../middlewares/auth.middleware";

export const followUser = async (req: AuthRequest, res: Response) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user?.userId;

  if (targetUserId === currentUserId) {
    res.status(400).json({ error: "You cannot follow yourself" });
    return;
  }

  const targetUser = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId);

  if (!targetUser || !currentUser) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (targetUser.followers.includes(currentUser._id as Types.ObjectId)) {
    res.status(400).json({ error: "Already following this user" });
    return;
  }

  targetUser.followers.push(currentUser._id as Types.ObjectId);
  currentUser.following.push(targetUser._id as Types.ObjectId);

  await targetUser.save();
  await currentUser.save();

  res.status(200).json({ message: "Followed user" });
};

export const unfollowUser = async (req: AuthRequest, res: Response) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user?.userId;

  if (targetUserId === currentUserId) {
    res.status(400).json({ error: "You cannot unfollow yourself" });
    return;
  }

  const targetUser = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId);

  if (!targetUser || !currentUser) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== currentUserId
  );
  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== targetUserId
  );

  await targetUser.save();
  await currentUser.save();

  res.status(200).json({ message: "Unfollowed user" });
};
