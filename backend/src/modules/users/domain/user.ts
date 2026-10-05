import { RoleEnum } from "./roles"

export type User = {
  id: string | number,
  name: string,
  email: string,
  role?: RoleEnum,
  createdAt: Date,
  deletedAt?: Date
}

export type UserInput = Omit<User, "id" | "createdAt" | "deletedAt"> & {
    id?: User["id"]
}

export interface UserListParams {
  page: number;
  limit: number;
  role?: User["role"];
  name?: User["name"];
}

export interface UserListResult {
  data: User[];
  page: number;
  limit: number;
  total: number;
}
