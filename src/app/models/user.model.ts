// In your user.model.ts file
import { Schema, model } from "mongoose";
import { IUser, UserRole } from "../interface/user.interface";
import validator from "validator";

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: [true, "Email is already exists with another user!"],
      trim: true,
      lowercase: true,
      // match: [/.+\@.+\..+/, "Enter a valid Email. You have entered {VALUE}"],
      // validate: {
      //   validator: function (v: string) {
      //     return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      //   },
      //   message: (props: { value: string }) => `${props.value} is not a valid email!`,
      // },
      validate: [validator.isEmail, "Your email '{VALUE}' is not valid!"],
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: {
        values: Object.values(UserRole),
        message: "Role must be one of the following: " + Object.values(UserRole).join(", "),
      },
      default: UserRole.USER,
      uppercase: true,
      trim: true,
    },
    age: { type: Number, required: true, min: [18, "Must be at least 18, got {VALUE}"], max: 100 },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const User = model<IUser>("User", userSchema);
