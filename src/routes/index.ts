import { FastifyInstance } from "fastify";
import { serverRoutes } from "./server-routes.js";

export async function routes(fastify: FastifyInstance) {
  serverRoutes(fastify)
}