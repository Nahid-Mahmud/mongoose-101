interface INote {
  title: string;
  content: string;
  category?: "work" | "personal" | "study" | "other";
  pinned?: boolean;
  tags?: {
    label: string;
    color?: string;
  };
}

export default INote;
