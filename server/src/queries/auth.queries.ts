import { dbClient } from "../models/db";
import { User } from "../models/user"; 

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await dbClient.execute({
    sql: "SELECT * FROM users WHERE email = ? LIMIT 1",
    args: [email],
  });
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    password: row.password,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  } as unknown as User;
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const result = await dbClient.execute({
    sql: "SELECT * FROM users WHERE username = ? LIMIT 1",
    args: [username],
  });
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    password: row.password,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  } as unknown as User;
}

export async function createUser({
  username,
  email,
  password,
  avatar,
  bio,
}: {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
}) {
  const userId = crypto.randomUUID();
  const result = await dbClient.execute({
    sql: `
      INSERT INTO users (id, username, email, password, avatar, bio, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    args: [userId, username, email, password, avatar || null, bio || null],
  });

  return result;
}
