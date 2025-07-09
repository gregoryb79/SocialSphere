import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { followUser, unfollowUser } from "../controllers/user.controller";

export const router = express.Router();

router.post("/:id/follow", authenticate, followUser);
router.post("/:id/unfollow", authenticate, unfollowUser);
