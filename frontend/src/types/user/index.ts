export interface UserListResult {
  data: User[];
  page: number;
  limit: number;
  total: number;
}

export type User = {
  id: string | number
  name: string
  email: string
  role: Role
  createdAt: string
}

export const Role = {
  admin: 'A',
  user: 'U',
} as const

export type Role = (typeof Role)[keyof typeof Role]

export type UserInput = Omit<User, "id" | "createdAt"> & {
  id?: User["id"]
}
