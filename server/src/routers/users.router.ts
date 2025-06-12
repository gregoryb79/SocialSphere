import express from 'express';
export const router = express.Router();

router.get("/", async (_, res) => {
    res.status(200).json({
        message: "Welcome to the SocialSphere history API",});
});