import { User, UserInput, UserListParams } from "../domain/user";
import { IUserRepository } from "../domain/user.repo";
import { UserNotFoundError } from "./erros/UserNotFoundErro";

export class UserService {
    constructor(private repo: IUserRepository) {
    }

    list = async (params: UserListParams) => {
        return this.repo.list(params);
    }

    getById = async (id: User["id"]) => {
        const user = await this.repo.getById(id);
        if(!user) {
            throw new UserNotFoundError(id);
        }
        return user;
        }

    upsert = async (input: UserInput) => {
        if(input.id !== undefined){
            const user = await this.repo.getById(input.id);
            
            if(!user) {
                throw new UserNotFoundError(input.id);
            }

            return this.repo.update(input.id, input);
        }
        return this.repo.create(input);
    }

    delete = async (id: User["id"]) => {
        const user = await this.repo.getById(id);
        
        if(!user) {
            throw new UserNotFoundError(id);
        }

        return this.repo.delete(id);
    }
}
