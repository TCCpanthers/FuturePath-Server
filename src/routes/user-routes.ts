import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CadastrarUsuarioController } from "../controllers/usuarios/cadastrar.usuario.controller.js";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/cadastro", async(req: FastifyRequest, rep: FastifyReply) => {
    return new CadastrarUsuarioController().handle(req, rep)
  })

}