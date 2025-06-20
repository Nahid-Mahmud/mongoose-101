"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const noteSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        enum: ["work", "personal", "study", "other"],
        default: "personal",
    },
    pinned: {
        type: Boolean,
        default: false,
    },
    tags: {
        label: { type: String },
        color: { type: String, default: "blue" },
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    versionKey: false, // Disable __v field
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});
const Note = (0, mongoose_1.model)("Note", noteSchema);
exports.default = Note;
