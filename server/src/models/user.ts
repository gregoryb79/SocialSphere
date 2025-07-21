import { dbClient } from "./db";

export type User = {
    id: string;
    username: string;
    email: string;
    password: string;
    bio?: string;
    avatar?: string;
    followers: string[];
    following: string[];
    bookmarks: string[];
    created_at: string;
    updated_at: string;
};

export async function listUsers() {
    const result = await dbClient.execute("SELECT * FROM users");
    return result.rows;
}

export async function getUserById(id: string) : Promise<User | null> {
    const rawUserResult = await dbClient.execute(`SELECT * FROM users WHERE id = '${id}'`);
    if (rawUserResult.rows.length === 0) {
        return null;
    }
    const rawUser = rawUserResult.rows[0];
    const followersResult = await dbClient.execute(`SELECT follower_id FROM user_followers WHERE user_id = '${id}'`);
    const followers = followersResult.rows;
    const followingResult = await dbClient.execute(`SELECT following_id FROM user_following WHERE user_id = '${id}'`);
    const following = followingResult.rows;
    const bookmarksResult = await dbClient.execute(`SELECT post_id FROM user_bookmarks WHERE user_id = '${id}'`);
    const bookmarks = bookmarksResult.rows;
    const result: User = {
        id: rawUser.id as string,
        username: rawUser.username as string,
        email: rawUser.email as string,
        password: "hashed password", // Do not return raw password
        bio: rawUser.bio as string,
        avatar: rawUser.avatar as string,
        followers: followers as unknown as string[],
        following: following as unknown as string[],
        bookmarks: bookmarks as unknown as string[],
        created_at: rawUser.created_at as string,
        updated_at: rawUser.updated_at as string
    };
    console.log(`Fetched user with ID: ${result.id}`, result);
    return result;
}

export async function deleteUser(id: string) {
    return dbClient.execute(`DELETE FROM users WHERE id = '${id}'`);
}

export async function updateUser(id: string, fields: any) {
  const updates = Object.entries(fields).map(([key, value]) => `${key} = ?`).join(", ");
  const params = Object.values(fields);
  return dbClient.execute(`UPDATE users SET ${updates}, updated_at= CURRENT_TIMESTAMP WHERE id = ?`, [...params as (string | number | boolean)[], id]);
}

