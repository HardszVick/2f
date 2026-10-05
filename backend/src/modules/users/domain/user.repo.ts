import { User, UserInput, UserListParams, UserListResult } from "./user";

export interface IUserRepository {
    list(params: UserListParams): Promise<UserListResult>;
    getById(id: User["id"]): Promise<User | null>;
    create(input: UserInput): Promise<User>;
    update(id: User["id"], input: UserInput): Promise<User>;
    delete(id: User["id"]): Promise<void>;
}
