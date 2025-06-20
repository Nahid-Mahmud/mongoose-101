"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const user_model_1 = require("../models/user.model");
exports.userRoutes = (0, express_1.Router)();
// Define a schema for user creation validation
const userCreationSchema = zod_1.z.object({
    firstName: zod_1.z
        .string({
    // invalid_type_error: "First name must be a string",
    // required_error: "First name is required",
    // description: "First name of the user",
    })
        .min(2, "First name must be at least 2 characters long")
        .max(50)
        .trim(),
    lastName: zod_1.z.string().min(2).max(50).trim(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    age: zod_1.z.number().min(18).max(100),
    role: zod_1.z.enum(["USER", "ADMIN", "SUPERADMIN"]).default("USER").optional(),
    address: zod_1.z.object({
        street: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        zipCode: zod_1.z.number().optional(),
    }),
});
// crate user
exports.userRoutes.post("/create-user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    // //  hash the password
    // const hashedPassword = await bcrypt.hash(body.password, 10);
    // body.password = hashedPassword;
    try {
        // create a new user
        const validatedUserData = userCreationSchema.parseAsync(body);
        // console.log("Validated user data:", validatedUserData);
        // const newUser = new User(req.body);
        const newUser = new user_model_1.User(yield validatedUserData);
        // newUser.password = await newUser.hashPassword(newUser.password); // method from instance
        // const password = await User.hashPassword(newUser.password); // static method
        // newUser.password = password; // set the hashed password
        // const hashedPassword = await (body.password);
        const savedUser = yield newUser.save();
        res.status(201).json({
            message: "User created successfully",
            // user: savedUser,
            // send the user without password
            user: {
                _id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                age: savedUser.age,
                role: savedUser.role,
                address: savedUser.address,
            },
        });
    }
    catch (error) {
        // console.error("Error creating user:", error);
        res.status(400).send({
            success: false,
            message: error.message,
            error,
        });
    }
}));
// get all users
exports.userRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.User.find().sort({ firstName: "asc", email: "desc" }).skip(5).limit(5);
        // .select("-password");
        if (!users || users.length === 0) {
            res.status(404).json({ message: "No users found" });
        }
        res.status(200).json({ users, success: true, message: "Users fetched successfully", total: users.length });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}));
// update user
exports.userRoutes.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const updateData = req.body;
    try {
        // check if the user exists
        const updateUser = yield user_model_1.User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
        res.status(200).json({
            message: "User updated successfully",
            user: updateUser,
            success: true,
        });
    }
    catch (error) {
        console.error("Error fetching user:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}));
// get user by id
exports.userRoutes.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        // check if the user exists
        const user = yield user_model_1.User.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user, success: true, message: "User fetched successfully" });
    }
    catch (error) {
        console.error("Error fetching user:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}));
// delete user
exports.userRoutes.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        // check if the user exists
        const deletedUser = yield user_model_1.User.findOneAndDelete({ _id: userId });
        if (!deletedUser) {
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User deleted successfully",
            user: deletedUser,
            success: true,
        });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}));
