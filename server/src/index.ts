import "dotenv/config";
import dotenv from "dotenv";
import { createServer } from "http";
import { app } from "./app";
import { dbClient } from "./models/db";
import { initDb } from "./models/initDb";

dotenv.config();

const server = createServer(app);
const port = process.env.PORT || 5000;

async function init() {
    try {
        const result = await dbClient.execute("SELECT 1 as test");
        console.log("Connected to Turso:", result.rows);

        await initDb();

        server.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.error("Faild to connect to Turso:", error);
        process.exit(1);
    }
}

init();
