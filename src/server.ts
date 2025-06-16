import "dotenv/config";

import app from "./app";
import mongoose from "mongoose";

const mongodbUri = process.env.MONGODB_URI;
const port = process.env.PORT;

async function main() {
  let server;
  try {
    if (!mongodbUri) {
      throw new Error("MONGODB_URI environment variable is not set. 🥲");
    }
    await mongoose.connect(mongodbUri).then(() => {
      console.log("Connected to MongoDB successfully");
    });
    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

main();
