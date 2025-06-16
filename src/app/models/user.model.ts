// In your user.model.ts file
import { Schema, model } from "mongoose";
import { IUser, UserRole } from "../interface/user.interface";

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: UserRole,
    default: UserRole.user,
  },
});

export const User = model<IUser>("User", userSchema);
