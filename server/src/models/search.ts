import { dbClient } from "./db";

export async function searchUsersByUsername(searchTerm: string) {
    if (!searchTerm) {
        return [];
    }

    const lowerCaseSearchTerm = `%${searchTerm.toLowerCase()}%`;
    try {
        const result = await dbClient.execute({
            sql: "SELECT id, username, avatar, bio FROM users WHERE LOWER(username) LIKE ?",
            args: [lowerCaseSearchTerm],
        });

        return result.rows;
    } catch (error) {
        console.error("Error searching users by username:", error);
        throw error;
    }
};

export async function searchPostsByContent(searchTerm: string) {
     if (!searchTerm) {
        return [];
     }

     const lowerCaseSearchTerm = `%${searchTerm.toLowerCase()}%`;

    try {
        const result = await dbClient.execute({
            sql: `SELECT c.id, c.author_id, c.content, c.image, c.created_at, c.updated_at,
                         u.username as author_name
                  FROM comments c
                  INNER JOIN users u ON c.author_id = u.id
                  WHERE c.parent_id IS NULL AND LOWER(c.content) LIKE ?`,
            args: [lowerCaseSearchTerm],
        });

        return result.rows;
    } catch (error) {
        console.error("Error searching posts by content:", error);
        throw error;
    }
};
