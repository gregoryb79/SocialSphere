import { dbClient } from "../models/db";
import { User } from "../models/user"; 

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await dbClient.execute({
    sql: "SELECT * FROM users WHERE email = ? LIMIT 1",
    args: [email],
  });
  return result.rows[0] || null;
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const result = await dbClient.execute({
    sql: "SELECT * FROM users WHERE username = ? LIMIT 1",
    args: [username],
  });
  return result.rows[0] || null;
}

export async function createUser({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) {
  const result = await dbClient.execute({
    sql: `
      INSERT INTO users (username, email, password, created_at, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    args: [username, email, password],
  });

  return result;
}
