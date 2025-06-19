import { Types } from "mongoose";

interface INote {
  title: string;
  content: string;
  category?: "work" | "personal" | "study" | "other";
  pinned?: boolean;
  tags?: {
    label: string;
    color?: string;
  };
  user: Types.ObjectId;
}

export default INote;
