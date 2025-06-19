import express, { Request, Response } from "express";
import Note from "../models/notes.model";

const notesRouter = express.Router();

notesRouter.post("/create-note", async (req: Request, res: Response) => {
  const { title, content, user } = req.body;
  // check for valid userId
  // const user = await Note.findById(userId);
  // if (!user) {
  //   res.status(400).json({ message: "Invalid user ID" });
  // }
  try {
    const newNote = new Note({
      title,
      content,
      user,
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

notesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const notes = await Note.find()
      .populate({
        path: "user",
        select: "-password -address -role -age -createdAt -updatedAt",
      })
      .sort({ createdAt: -1 });
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

notesRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // one way to handle this
    // const notes = await Note.findOne({
    //   _id: id,
    // });
    // another way to handle this
    const note = await Note.findById(id);

    res.status(200).json(note);
  } catch (error: unknown) {
    console.error("Error fetching note:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

notesRouter.patch("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: Record<string, any> = req.body;

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

    const updateNote = await Note.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updateNote) {
      res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({
      message: "Note updated successfully",
      note: updateNote,
    });
  } catch (error: unknown) {
    console.error("Error updating note:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

notesRouter.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // const deletedNote = await Note.findByIdAndDelete(id);
    const deletedNote = await Note.findOneAndDelete({ _id: id });
    // const deletedNote = await Note.deleteOne({ _id: id });
    if (!deletedNote) {
      res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({
      message: "Note deleted successfully",
      note: deletedNote,
    });
  } catch (error: unknown) {
    console.error("Error deleting note:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default notesRouter;
