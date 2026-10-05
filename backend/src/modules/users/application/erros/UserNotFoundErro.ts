import { User } from "../../domain/user";

export class UserNotFoundError extends Error {
  constructor(id: User["id"]) {
    super(`User with id "${id}" not found.`);
    this.name = "UserNotFoundError";
  }
}