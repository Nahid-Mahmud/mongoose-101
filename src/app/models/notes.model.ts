import { model, Schema } from "mongoose";
import INote from "../interface/notes.interface";

const noteSchema = new Schema<INote>(
  {
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
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    versionKey: false, // Disable __v field
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Note = model<INote>("Note", noteSchema);

export default Note;
