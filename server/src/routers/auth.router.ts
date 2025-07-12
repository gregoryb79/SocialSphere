// src/routers/auth.router.ts
import express from "express";
import { register, login } from "../controllers/auth.controller";

export const router = express.Router();

router.post("/register", register);
router.post("/login", login);
