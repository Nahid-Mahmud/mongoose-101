import express, { Application, Request, Response } from "express";
import notesRouter from "./app/controllers/notes.controller";

const app: Application = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/notes",notesRouter);

// Route to create a new note

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running! 😍");
});

export default app;
