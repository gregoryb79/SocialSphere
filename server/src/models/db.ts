import { createClient } from "@libsql/client";

export const dbClient = createClient({
    url: process.env.TURSO_URL!,
    authToken: process.env.TURSO_TOKEN,
});