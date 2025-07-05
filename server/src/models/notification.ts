import { dbClient } from "./db";

export type NoticifactionType = "like" | "comment" | "follow";

export type Notification = {
    id: string;
    recipient_id: string;
    sender_id: string;
    type: NoticifactionType;
    post_id?: string | null;
    seen: number;
    created_at: string;
};

export async function createNotification(data: { recipient_id: string; sender_id: string; type: NoticifactionType; post_id?: string; }) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await dbClient.execute(
        `INSERT INTO notifications
        (id, recipient_id, sender_id, post_id, seen, created_at')
        VALUES (?, ?, ?, ?, ? ,?, ?)`,
        [id, data.recipient_id, data.sender_id, data.type, data.post_id || null, 0, now]
    );

    return id;
}

export async function getNotificationsByUser(userId: string) {
    const result = await dbClient.execute(
        `SELECT * FROM notifications
        WHERE recipient_id = ?
        ORDER by created_at DESC`,
        [userId]
    );

    return result.rows;
}

export async function markNotificationAsSeen(id: string) {
    await dbClient.execute(
        `UPDATE notifications SET seen = 1 WHERE id =?`,
        [id]
    );
}

export async function markAllNotificationsAsSeen(userId: string) {
    await dbClient.execute(
        `UPDATE notifications SET seen = 1 WHERE recipient_id =?`,
        [userId]
    );
}

export async function deleteNotification(id: string) {
    await dbClient.execute(
        `DELETE FROM notifications WHERE id =?`,
        [id]
    );
}