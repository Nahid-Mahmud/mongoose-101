import express, { Request, Response, Router } from "express";
import { User } from "../models/user.model";
import { z } from "zod";

export const userRoutes = Router();

// Define a schema for user creation validation
const userCreationSchema = z.object({
  firstName: z
    .string({
      // invalid_type_error: "First name must be a string",
      // required_error: "First name is required",
      // description: "First name of the user",
    })
    .min(2, "First name must be at least 2 characters long")
    .max(50)
    .trim(),
  lastName: z.string().min(2).max(50).trim(),
  email: z.string().email(),
  password: z.string().min(6),
  age: z.number().min(18).max(100),
  role: z.enum(["USER", "ADMIN", "SUPERADMIN"]).default("USER").optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.number().optional(),
  }),
});

// crate user

userRoutes.post("/create-user", async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // create a new user

    const validatedUserData = userCreationSchema.parseAsync(req.body);

    // console.log("Validated user data:", validatedUserData);

    // const newUser = new User(req.body);
    const newUser = new User(await validatedUserData);

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error: any) {
    // console.error("Error creating user:", error);
    res.status(400).send({
      success: false,
      message: error.message,
      error,
    });
  }
});

// get all users

userRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    if (!users || users.length === 0) {
      res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({ users, success: true, message: "Users fetched successfully" });
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

// update user
userRoutes.put("/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  const updateData = req.body;

  try {
    // check if the user exists
    const updateUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
    res.status(200).json({
      message: "User updated successfully",
      user: updateUser,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

// get user by id

userRoutes.get("/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    // check if the user exists
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user, success: true, message: "User fetched successfully" });
  } catch (error: unknown) {
    console.error("Error fetching user:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

// delete user
userRoutes.delete("/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    // check if the user exists
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser,
      success: true,
    });
  } catch (error: unknown) {
    console.error("Error deleting user:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});
