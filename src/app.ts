import express, { Application, Request, Response } from "express";
import { model, Schema } from "mongoose";

const app: Application = express();

// Middleware to parse JSON bodies
app.use(express.json());

const noteSchema = new Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = model("Note", noteSchema);

// Route to create a new note
app.post("/notes/create-note", async (req: Request, res: Response) => {
  const { title, content } = req.body;
  try {
    const newNote = new Note({
      title,
      content,
    });
    const savedNote = await newNote.save();
    res.status(201).json({
      message: "Note created successfully",
      note: savedNote,
    });
  } catch (error: unknown) {
    console.error("Error creating note:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

app.get("/notes", async (req: Request, res: Response) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error: unknown) {
    console.error("Error fetching notes:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});




app.get("/", (req: Request, res: Response) => {
  res.send("Server is running! 😍");
});

export default app;
