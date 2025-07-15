import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { json } from "body-parser";


import { router as notificationRouter } from "./routers/notifications.route";  
import { router as postsRouter } from "./routers/posts.router";
import { router as commentsRouter} from "./routers/comments.router";
import { router as searchRouter} from "./routers/search.router"; 
import { router as authRouter } from "./routers/auth.router";
import { router as usersRouter} from "./routers/users.router";

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
app.use("/auth", authRouter);

app.use("/api/notifications", notificationRouter)
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/search", searchRouter);



