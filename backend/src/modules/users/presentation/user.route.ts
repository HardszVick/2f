import { FastifyInstance } from "fastify";
import { errorSchema, successSchema, UserInputBody, UserListQuery, UserParams, userInputSchema, userListQuerySchema, userListResultSchema, userParamsSchema, userSchema } from "./user.schema";
import { UserService } from "../application/user";

const registerUserRoutes = (app: FastifyInstance, service : UserService) => {
    app.get<{ Params: UserParams }>("/users/:id",{
      schema: {
        tags: ["Users"],
        summary: "Get a user by ID",
        params: userParamsSchema,
        response: {
          200: userSchema,
          404: errorSchema,
        },
      },
    }, async (request, reply) =>{
        const user = await service.getById(request.params.id);
        return reply.send(user);
    })

    app.get<{ Querystring: UserListQuery }>("/users",{schema: {
        tags: ["Users"],
        summary: "List users",
        querystring: userListQuerySchema,
        response: {
          200: userListResultSchema,
        },
      },} , async (request, reply) => {
        const DEFAULT_PAGE = 1;
        const DEFAULT_LIMIT = 50;

        const page = request.query.page ?? DEFAULT_PAGE;
        const limit = request.query.limit ?? DEFAULT_LIMIT;
        const name = request.query.name === undefined ? {} : { name: request.query.name };
        const role = request.query.role === undefined ? {} : { role: request.query.role };

        const result = await service.list({
          page,
          limit,
          ...name,
          ...role,
        });
        return reply.send(result);
      })

    app.put<{ Body: UserInputBody }>("/users", {schema: {
        tags: ["Users"],
        summary: "Create or update a user",
        body: userInputSchema,
        response: {
            200: userSchema,
            201: userSchema,
            404: errorSchema,
        }
    }}, async (request, reply) => {
        const isNewUser = request.body.id === undefined;
        const id = request.body.id === undefined ? {} : { id: request.body.id }
        
        const input = {
          name: request.body.name,
          email: request.body.email,
          role: request.body.role,
          ...id,
        };
        const user = await service.upsert(input);
        return reply.status(isNewUser ? 201 : 200).send(user);
    })

    app.delete<{ Params: UserParams }>("/users/:id",{schema: {
        tags: ["Users"],
        summary: "Delete a user",
        params: userParamsSchema,
        response: {
            200: successSchema,
            404: errorSchema,
        }
    }}, async (request, reply) => {
        await service.delete(request.params.id);
        return reply.send({ message: "User deleted successfully" });
    })  
}

export default registerUserRoutes;
