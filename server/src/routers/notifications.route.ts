import { Router } from "express";
import { createNotification, deleteNotification, getNotificationsByUser, markAllNotificationsAsSeen, markNotificationAsSeen } from "../models/notification";

export const router = Router();

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await getNotificationsByUser(userId);
        res.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
});

router.post("/", async (req, res) => {
    try {
        const {recipient_id, sender_id, type, post_id } = req.body;
        const id = await createNotification({ recipient_id, sender_id, type, post_id });
        res.status(201).json({ id });
        } catch (error) {
            console.error("Error creating notification:", error);
            res.status(500).json({ error: "Failed to create notification" });
        }
});

router.patch("/:id/seen", async (req, res) => {
    try {
        const { id } = req.params; 
        await markNotificationAsSeen(id);
        res.json({ message: "Notification marked as seen" });
    } catch (error) {
        console.error("Error marking notification as seen:", error);
        res.status(500).json({ error: "Failed to mark notification as seen" });
    }
});

router.patch("/user/:userId/seen", async (req, res) => {
    try {
        const { userId } = req.params;
        await markAllNotificationsAsSeen(userId);
        res.json({ message: "All notifications marked as seen" });
    } catch (error) {
        console.error("Error markign all notifications as seen:", error);
        res.status(500).json({ error: "Failed to mark all notifications as seen" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await deleteNotification(id);
        res.json({ message: "Notification deleted" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ error: "Failed to delete notification" });
    }
});

export default router;