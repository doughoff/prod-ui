export type Status = "ACTIVE" | "INACTIVE";
export type Roles = "ADMIN" | "OPERATOR";

export interface User {
  id: string;
  status: Status;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  roles: Roles[];
}
export interface CreateUser {
  name: string;
  email: string;
  password: string;
  roles: Roles[];
}
export interface EditUser {
  name: string;
  email: string;
  password: string;
  roles: Roles[];
  status: Status;
}
