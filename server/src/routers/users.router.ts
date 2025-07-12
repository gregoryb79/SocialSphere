import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { followUser, unfollowUser } from "../controllers/user.controller";

export const router = express.Router();
import { dbClient } from "../models/db";

router.get("/", async (_, res) => {
    res.status(200).json({
        message: "Welcome to the SocialSphere users API",});
});

router.post("/:id/follow", authenticate, followUser);
router.post("/:id/unfollow", authenticate, unfollowUser);
