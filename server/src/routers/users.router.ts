import express from 'express';
export const router = express.Router();
import { dbClient } from "../models/db";

router.get("/", async (_, res) => {
    res.status(200).json({
        message: "Welcome to the SocialSphere users API",});
});

