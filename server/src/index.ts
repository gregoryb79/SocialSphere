import "dotenv/config";
import dotenv from "dotenv";
import { createServer } from "http";
import { app } from "./app";
import { dbClient } from "./models/db";
import { initDb } from "./models/initDb";
import { seedDatabase } from "./models/generatedBdata";

dotenv.config();

const server = createServer(app);
const port = process.env.PORT || 5050;
console.log("Starting server...");
console.log(`Port: ${port}`);

async function init() {
    try {
        console.log("🔍 Environment check:");
        console.log("Database URL:", process.env.TURSO_URL ? "✅ Set" : "❌ Missing");
        console.log("Auth Token:", process.env.TURSO_TOKEN ? "✅ Set" : "❌ Missing");
        
        if (!process.env.TURSO_URL || !process.env.TURSO_TOKEN) {
            throw new Error("Missing required environment variables");
        }
        
        console.log("🔗 Attempting to connect to Turso...");
        const result = await dbClient.execute("SELECT 1 as test");
        console.log("Connected to Turso:", result.rows);

        await initDb();
        await seedDatabase();

        server.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.error("Faild to connect to Turso:", error);
        process.exit(1);
    }
}

init();
