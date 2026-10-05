import { and, count, eq, ilike, isNull, SQL } from "drizzle-orm";
import { db, DatabaseClient } from "../../../shared/database";
import { users } from "../../../shared/database/schema";
import { UserListParams, User, UserInput, UserListResult } from "../domain/user";
import { IUserRepository } from "../domain/user.repo";
import { RoleEnum } from "../domain/roles";
import { UserNotFoundError } from "../application/erros/UserNotFoundErro";

export default class UserRepository implements IUserRepository {
    constructor(private readonly database: DatabaseClient = db) {}

    list = async(params: UserListParams): Promise<UserListResult> => {
        const normalizedName = params.name?.trim().toLocaleLowerCase();
        const conditions: SQL[] = [isNull(users.deletedAt)];

        if (params.role) {
            conditions.push(eq(users.role, params.role));
        }

        if (normalizedName) {
            conditions.push(ilike(users.name, `%${normalizedName}%`));
        }

        const where = and(...conditions);
        const offset = (params.page - 1) * params.limit;
        const [data, totals] = await Promise.all([
            this.database
                .select({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    role: users.role,
                    createdAt: users.createdAt,
                })
                .from(users)
                .where(where)
                .limit(params.limit)
                .offset(offset),
            this.database
                .select({ value: count() })
                .from(users)
                .where(where),
        ]);

        return {
            data,
            page: params.page,
            limit: params.limit,
            total: totals[0]?.value ?? 0,
        };
    }

    getById = async(id: User["id"]): Promise<User | null> => {
        const databaseId = this.parseId(id);
        if (databaseId === null) return null;

        const result = await this.database
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                createdAt: users.createdAt,
            })
            .from(users)
            .where(and(eq(users.id, databaseId), isNull(users.deletedAt)))
            .limit(1);

        return result[0] ?? null;
    }

    create = async(input: UserInput): Promise<User> => {
        const result = await this.database
            .insert(users)
            .values({
                name: input.name,
                email: input.email,
                role: input.role ?? RoleEnum.user,
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                createdAt: users.createdAt,
            });

        return result[0]!;
    }

    update = async(id: User["id"], input: UserInput): Promise<User> => {
        const databaseId = this.parseId(id);
        if (databaseId === null) {
            throw new UserNotFoundError(id);
        }

        const result = await this.database
            .update(users)
            .set({
                name: input.name,
                email: input.email,
                ...(input.role === undefined ? {} : { role: input.role }),
            })
            .where(and(eq(users.id, databaseId), isNull(users.deletedAt)))
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                createdAt: users.createdAt,
            });
        const updatedUser = result[0];

        if (!updatedUser) {
            throw new UserNotFoundError(id);
        }

        return updatedUser;
    }

    delete = async(id: User["id"]): Promise<void> => {
        const databaseId = this.parseId(id);
        if (databaseId === null) {
            throw new UserNotFoundError(id);
        }

        const result = await this.database
            .update(users)
            .set({ deletedAt: new Date() })
            .where(and(eq(users.id, databaseId), isNull(users.deletedAt)))
            .returning({ id: users.id });
        const deletedUser = result[0];

        if (!deletedUser) {
            throw new UserNotFoundError(id);
        }
    }

    private parseId(id: User["id"]): number | null {
        const parsedId = Number(id);
        return Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null;
    }
}
