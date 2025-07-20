import { Request, Response } from "express";
import { findUserByEmail, findUserByUsername, createUser } from "../queries/auth.queries";
import { hashPassword, comparePasswords } from "../utils/hash";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await findUserByUsername(username) || await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already in use" });
    }

    const hashedPassword = await hashPassword(password);
    await createUser({ username, email, password: hashedPassword });

    const newUser = await findUserByEmail(email);
    if (!newUser) return res.status(500).json({ error: "User creation failed" });

    const token = generateToken(newUser.id);
    res.status(201).json({ token });
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
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id);
    res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
