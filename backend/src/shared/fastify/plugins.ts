import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "@fastify/type-provider-zod";
import { FastifyInstance } from "fastify";
import ratelimiter from "@fastify/rate-limit";
import helmet from "@fastify/helmet"
import cors from "@fastify/cors";

const registerPlugins = async (app: FastifyInstance) => {
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
        await app.register(cors, {
        origin: process.env.URL_FRONT ?? "http://localhost:5173/",
    });

    await app.register(ratelimiter, {
        max: 100,
        timeWindow: '1 minute'
    })

    await app.register(
        helmet,
        { contentSecurityPolicy: false }
    )


    await app.register(fastifySwagger, {
        openapi: {
            info: {
                title: "Users API",
                description: "API for managing users",
                version: "1.0.0",
            },
            tags: [{ name: "Users", description: "User management" }],
        },
        transform: jsonSchemaTransform,
    });

    await app.register(fastifySwaggerUI, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "list",
            deepLinking: true,
        },
    });
}

export default registerPlugins;