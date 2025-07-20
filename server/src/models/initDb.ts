import { dbClient } from "./db";

export async function initDb() {
  await dbClient.batch([
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      bio TEXT,
      avatar TEXT,
      created_at TEXT,
      updated_at TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      author_id TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT,
      created_at TEXT,
      updated_at TEXT,
      FOREIGN KEY (author_id) REFERENCES users(id)
    );`,
    `CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      author_id TEXT NOT NULL,
      parent_id TEXT,  
      content TEXT NOT NULL,
      image TEXT,
      created_at TEXT,
      updated_at TEXT,
      FOREIGN KEY (author_id) REFERENCES users(id)
    );`,
    `CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      recipient_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow')),
      sender_id TEXT NOT NULL,
      post_id TEXT,
      seen INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (recipient_id) REFERENCES users(id),
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (post_id) REFERENCES posts(id)
    );`,
    `CREATE TABLE IF NOT EXISTS user_followers (
      user_id TEXT NOT NULL,
      follower_id TEXT NOT NULL,
      PRIMARY KEY (user_id, follower_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (follower_id) REFERENCES users(id)
    );`,
    `CREATE TABLE IF NOT EXISTS user_following (
      user_id TEXT NOT NULL,
      following_id TEXT NOT NULL,
      PRIMARY KEY (user_id, following_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (following_id) REFERENCES users(id)
    );`,
    `CREATE TABLE IF NOT EXISTS user_bookmarks (
      user_id TEXT NOT NULL,
      post_id TEXT NOT NULL,
      PRIMARY KEY (user_id, post_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (post_id) REFERENCES posts(id)
    );`,
    `CREATE TABLE IF NOT EXISTS post_likes (
      post_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      PRIMARY KEY (post_id, user_id),
      FOREIGN KEY (post_id) REFERENCES posts(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );`,

    `CREATE TABLE IF NOT EXISTS comment_likes (
      comment_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      PRIMARY KEY (comment_id, user_id),
      FOREIGN KEY (comment_id) REFERENCES comments(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );`,
    `CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      user1_id TEXT NOT NULL,
      user2_id TEXT NOT NULL,
      created_at TEXT,
      FOREIGN KEY(user1_id) REFERENCES users(id),
      FOREIGN KEY(user2_id) REFERENCES users(id)
    );`,
    `CREATE TABLE IF NOT EXISTS chat_participants (
      chat_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      PRIMARY KEY (chat_id, user_id),
      FOREIGN KEY (chat_id) REFERENCES chats(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );`,
    `CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      text TEXT,
      created_at TEXT,
      FOREIGN KEY (chat_id) REFERENCES chats(id),
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (receiver_id) REFERENCES users(id)
    );`,
    `CREATE TABLE IF NOT EXISTS friends (
    id TEXT PRIMARY KEY,
    user1_id TEXT NOT NULL,
    user2_id TEXT NOT NULL,
    FOREIGN KEY(user1_id) REFERENCES users(id),
    FOREIGN KEY(user2_id) REFERENCES users(id)
    );`,
  ]);

  console.log("✅ All tables created in Turso database");
  console.log("Starting database seeding...");

  try {
    const check = await dbClient.execute({
      sql: `INSERT INTO friends (id, user1_id, user2_id) VALUES (?, ?, ?)`,
      args: ["friend-user1-user2", "user1", "user2"],
    });

    if (check.rows.length === 0) {
    const existing = await dbClient.execute({
      sql: `SELECT id FROM friends WHERE id=?`,
      args: ["friend-user1-user2"],
    });

    if (existing.rows.length === 0) {
      await dbClient.execute({
        sql: `INSERT INTO friends (id, user1_id, user2_id) VALUES (?, ?, ?)`,
        args: ["friend-user1-user2", "user1", "user2"],
      });

    console.log("Seeded friendship between user1 and user2");
    } else {
      console.log("Friendship already exists. Skipping...");
    }
  }
  } catch (error) {
    console.error("Failed to seed friendship:", error);
  }
}
