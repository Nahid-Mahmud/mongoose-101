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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notes_model_1 = __importDefault(require("../models/notes.model"));
const notesRouter = express_1.default.Router();
notesRouter.post("/create-note", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, user } = req.body;
    // check for valid userId
    // const user = await Note.findById(userId);
    // if (!user) {
    //   res.status(400).json({ message: "Invalid user ID" });
    // }
    try {
        const newNote = new notes_model_1.default({
            title,
            content,
            user,
        });
        const savedNote = yield newNote.save();
        res.status(201).json({
            message: "Note created successfully",
            note: savedNote,
        });
    }
    catch (error) {
        console.error("Error creating note:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}));
notesRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notes = yield notes_model_1.default.find()
            .populate({
            path: "user",
            select: "-password -address -role -age -createdAt -updatedAt",
        })
            .sort({ createdAt: -1 });
        res.status(200).json(notes);
    }
    catch (error) {
        console.error("Error fetching notes:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}));
notesRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // one way to handle this
        // const notes = await Note.findOne({
        //   _id: id,
        // });
        // another way to handle this
        const note = yield notes_model_1.default.findById(id);
        res.status(200).json(note);
    }
    catch (error) {
        console.error("Error fetching note:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}));
notesRouter.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    try {
        // const updateNote = await Note.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
        // const updateNote = await Note.findByIdAndUpdate(id, updateData, {
        //   new: true,
        //   runValidators: true
        // });
        //   const updateNote = await Note.updateOne(
        //   { _id: id },
        //   { $set: updateData },
        //   { new: true, runValidators: true }
        // );
        const updateNote = yield notes_model_1.default.findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true, runValidators: true });
        if (!updateNote) {
            res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({
            message: "Note updated successfully",
            note: updateNote,
        });
    }
    catch (error) {
        console.error("Error updating note:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}));
notesRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // const deletedNote = await Note.findByIdAndDelete(id);
        const deletedNote = yield notes_model_1.default.findOneAndDelete({ _id: id });
        // const deletedNote = await Note.deleteOne({ _id: id });
        if (!deletedNote) {
            res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({
            message: "Note deleted successfully",
            note: deletedNote,
        });
    }
    catch (error) {
        console.error("Error deleting note:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}));
exports.default = notesRouter;
