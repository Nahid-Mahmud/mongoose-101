import express, { Request, Response, Router } from "express";
import { User } from "../models/user.model";

export const userRoutes = Router();

// crate user

userRoutes.post("/create-user", async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // check if the user already exists
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
    }
    // create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

// get all users

userRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    if (!users || users.length === 0) {
      res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});
