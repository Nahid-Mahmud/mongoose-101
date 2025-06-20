"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notes_controller_1 = __importDefault(require("./app/controllers/notes.controller"));
const users_controllers_1 = require("./app/controllers/users.controllers");
const app = (0, express_1.default)();
// Middleware to parse JSON bodies
app.use(express_1.default.json());
app.use("/notes", notes_controller_1.default);
app.use("/users", users_controllers_1.userRoutes);
// Route to create a new note
app.get("/", (req, res) => {
    res.send("Server is running! 😍");
});
exports.default = app;
