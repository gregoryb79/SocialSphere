import { dbClient } from "../models/db";

export const followUserQuery = async (followerId: string, followingId: string) => {
  await dbClient.execute({
    sql: `
      INSERT INTO user_followers (follower_id, following_id)
      VALUES (?, ?)
    `,
    args: [followerId, followingId],
  });
};

export const unfollowUserQuery = async (followerId: string, followingId: string) => {
  await dbClient.execute({
    sql: `
      DELETE FROM user_followers
      WHERE follower_id = ? AND following_id = ?
    `,
    args: [followerId, followingId],
  });
};

export const isFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  const result = await dbClient.execute({
    sql: `
      SELECT 1 FROM user_followers
      WHERE follower_id = ? AND following_id = ?
      LIMIT 1
    `,
    args: [followerId, followingId],
  });
  return result.rows.length > 0;
};
