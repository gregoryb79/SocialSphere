import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { json } from "body-parser";
import { router as usersRouter} from "./routers/users.router";
import { router as postsRouter } from "./routers/posts.router";
import { router as commentsRouter} from "./routers/comments.router";
import { router as notificationRouter } from "./routers/notifications.route"; 
import { router as chatRouter } from "./routers/chat.route"; 
import cors from "cors";

export const app = express();

app.use(cors());

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use((req, _, next) => {
    console.log(new Date().toLocaleString(), req.method, req.url);
    next();
});

app.use(json());

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/notifications", notificationRouter)
app.use("/chat", chatRouter);