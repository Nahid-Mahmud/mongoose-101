import express, { Application, Request, Response } from "express";
import { model, Schema } from "mongoose";

const app: Application = express();

// Middleware to parse JSON bodies
app.use(express.json());

const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Note = model("Note", noteSchema);

// Route to create a new note
app.post("/create-note", async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running! 😍");
});

export default app;
