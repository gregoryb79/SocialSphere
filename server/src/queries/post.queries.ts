import { dbClient } from "../models/db";
import { randomUUID } from "crypto";

export async function createPost(authorId: string, content: string, image?: string) {
  const id = randomUUID();

  const result = await dbClient.execute({
    sql: `
  INSERT INTO comments (id, author_id, content, image, parent_id, created_at, updated_at)
  VALUES (?, ?, ?, ?, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`,
    args: [id, authorId, content, image || null],
  });

  return { id, authorId, content, image };
}
