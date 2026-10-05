import { FastifyInstance } from "fastify";
import { UserService } from "../../modules/users/application/user";
import UserRepository from "../../modules/users/infra/user.repo";
import registerUserRoutes from "../../modules/users/presentation/user.route";

const registerRoutes = async (app: FastifyInstance) => {
    const repository = new UserRepository();
    const service = new UserService(repository);
    registerUserRoutes(app, service);
}
export default registerRoutes;