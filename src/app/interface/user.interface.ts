export enum UserRole {
  user = "user",
  admin = "admin",
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}
