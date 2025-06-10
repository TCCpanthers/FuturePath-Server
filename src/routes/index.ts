import { FastifyInstance } from "fastify";
import { serverRoutes } from "./server-routes.js";
import { userRoutes } from "./user-routes.js";

export async function routes(fastify: FastifyInstance) {
  serverRoutes(fastify)
  userRoutes(fastify)
}