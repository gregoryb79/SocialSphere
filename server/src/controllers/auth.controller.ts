import { Request, Response } from "express";
import { findUserByEmail, findUserByUsername, createUser } from "../queries/auth.queries";
import { hashPassword, comparePasswords } from "../utils/hash";
import jwt from "jsonwebtoken";
import { getUserById } from "../models/user";
import { dbClient } from "../models/db";

const JWT_SECRET = process.env.JWT_SECRET!;

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const register  = async (req: Request, res: Response) => {
  try {
    const { username, email, password, avatar, bio } = req.body;

    const existingUser = await findUserByUsername(username) || await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: "Username or email already in use" });
      return;
    }

    const hashedPassword = await hashPassword(password);
    await createUser({ username, email, password: hashedPassword, avatar, bio });

    const newUser = await findUserByEmail(email);
    if (!newUser) {
      res.status(500).json({ error: "User creation failed" });
      return;
    }

    console.log("New user created:", newUser.username, newUser.id);    
    const token = generateToken(newUser.id);
    console.log("Token generated for user:", token);
    res.status(201).json({ token, username: newUser.username });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user || !(await comparePasswords(password, user.password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    console.log("User logged in:", user.username, user.id);
    const token = generateToken(user.id);
    console.log("Token generated for user:", token);
    res.status(200).json({ token, username: user.username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export async function updateUser(req: Request) {
  try {
    const userId = req.params.id;
    const user = req.body;

    if (user.currentPassword) {
      const existingUser = await getUserById(userId);

      if (!existingUser) {
        throw new Error("User not found");
      }

      if (!(await comparePasswords(user.currentPassword, existingUser.password))) {
        throw new Error("Current password is incorrect");
      }
    }

    let updates = Object.entries(user).map(([key, value]) => `${key} = ?`).join(", ");
     if (!user.password) {
        updates += ", password = password"; 
        }
    const params = Object.values(user);
    const updatedUser = await dbClient.execute(`UPDATE users SET ${updates}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [...params as (string | number | boolean)[], userId]);

    if (user.password) {
      const hashedPassword = await hashPassword(user.password);
      await dbClient.execute(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, userId]);
    }

    return updatedUser;
  } catch (err) {
    throw err;
  }
}