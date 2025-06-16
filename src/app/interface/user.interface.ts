enum UserRole {
  user,
  admin,
}

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}
