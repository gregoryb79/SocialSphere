import { Request, Response } from "express";
import { IUser, User } from "../models/user.model";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req: Request, res: Response) => {
  console.log("Registering user with body:", req.body);
  try {
    const { username, email, password, avatar, bio } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      console.log("Username or email already in use");
      res.status(400).json({ error: "Username or email already in use" });
      return;
    }

    const newUser  = await User.create({ username, email, password, avatar, bio }) as IUser;
    const token = generateToken((newUser._id as string).toString());

    res.status(201).json({ token });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Server error" });    
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(`Logging in user with email ${email} and password ${password}`);

    const user = await User.findOne({ email }) as IUser;
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateToken((user._id as string).toString());
    res.status(200).json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
