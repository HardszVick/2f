
import { z } from "zod";
import { RoleEnum } from "../domain/roles";

export const userParamsSchema = z.object({
  id: z.string().or(z.number()),
});

export const userSchema = z.object({
  id: z.string().or(z.number()),
  name: z.string(),
  email: z.email(),
  role: z.enum(RoleEnum).optional().default(RoleEnum.user),
  createdAt: z.date(),
});

export const userListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  name: z.string().min(1).optional(),
  role: z.enum(RoleEnum).optional(),
});

export const userListResultSchema = z.object({
  data: z.array(userSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
});

export const userInputSchema = z.object({
    id: z.string().or(z.number()).optional(),
    name: z.string().min(1),
    email: z.email(),
    role: z.enum(RoleEnum).optional().default(RoleEnum.user),
})

export const successSchema = z.object({
    message: z.string()
})

export const errorSchema = z.object({
  message: z.string(),
});

export type UserParams = z.infer<typeof userParamsSchema>;
export type UserListQuery = z.infer<typeof userListQuerySchema>;
export type UserInputBody = z.infer<typeof userInputSchema>;
