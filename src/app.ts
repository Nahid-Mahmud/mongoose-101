import express, { Application, Request, Response } from "express";

const app: Application = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req:Request, res:Response) => {
  res.send("Server is running! 😍");
});

export default app;
