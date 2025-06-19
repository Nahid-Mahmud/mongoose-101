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
  hashPassword(password: string): string;
}
