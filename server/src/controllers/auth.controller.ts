import { Request, Response } from "express";
import { IUser, User } from "../models/user.model";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already in use" });
    }

    const newUser  = await User.create({ username, email, password }) as IUser;
    const token = generateToken((newUser._id as string).toString());

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }) as IUser;
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken((user._id as string).toString());
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
