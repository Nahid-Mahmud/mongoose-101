import { Model } from "mongoose";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}

export interface IAddress {
  street: string;
  city: string;
  zipCode: number;
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  role: UserRole;
  address: IAddress;
}

export interface UserInstanceMethods {
  hashPassword(password: string): Promise<string>;
}

export interface UserStaticMethods extends Model<IUser> {
  hashPassword(password: string): string;
}
