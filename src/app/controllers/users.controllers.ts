import express, { Router } from "express";
import { User } from "../models/user.model";

export const userRoutes = Router();

// get all users

userRoutes.get("/", async (req, res) => {
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



