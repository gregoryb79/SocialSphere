import { dbClient } from "./db";

export async function areFriends(userId1: string, userId2: string) {
    const result = await dbClient.execute({
        sql: `SELECT * FROM friends
        WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)`,
        args: [userId1, userId2, userId2, userId1],
    });

    return result.rows.length > 0;
}