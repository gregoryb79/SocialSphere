import { dbClient } from "./db";

export type User = {
    id: string;
    username: string;
    email: string;
    password: string;
    bio?: string;
    avatar?: string;
    created_at: string;
    updated_at: string;
};

export async function listUsers() {
    const result = await dbClient.execute("SELECT * FROM users");
    return result.rows;
}

export async function getUserById(id: string) {
    const result = await dbClient.execute(`SELECT *FROM users WHERE id = '${id}'`);
    return result.rows[0];
}

export async function deleteUser(id: string) {
    return dbClient.execute(`DELETE FROM users WHERE id = '${id}'`);
}

export async function updateUser(id: string, fields: any) {
    const updates = Object.entries(fields).map(([key, value]) => `${key} = '${value}'`).join(", ");
    return dbClient.execute(`UPDATE users SET ${updates}, updated_at= CURRENT_TIMESTAMP WHERE id = "${id}`);
}

