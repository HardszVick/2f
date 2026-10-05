import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { RoleEnum } from "../../modules/users/domain/roles";

export const userRole = pgEnum("user_role", [RoleEnum.admin, RoleEnum.user]);

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    role: userRole("role").notNull().default(RoleEnum.user),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
