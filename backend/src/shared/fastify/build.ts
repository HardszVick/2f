import fastify, { FastifyError } from "fastify";
import registerPlugins from "./plugins";
import registerRoutes from "./routes";
import { UserNotFoundError } from "../../modules/users/application/erros/UserNotFoundErro";
import { closeDatabase, migrateDatabase } from "../database";

const buildServer = async () => {
    await migrateDatabase();
    const app = fastify({ logger: true });

    app.addHook("onClose", closeDatabase);
    
    await registerPlugins(app);
    await registerRoutes(app);

    app.setErrorHandler((error: FastifyError, request, reply) => {
        if (error instanceof UserNotFoundError) {
            return reply.status(404).send({ message: error.message });
        }

        if (error.validation) {
            return reply.status(400).send({ message: error.message });
        }

        request.log.error(error);
        return reply.status(500).send({ message: "Internal server error" });
    });
    
    return app;
}

export default buildServer;
