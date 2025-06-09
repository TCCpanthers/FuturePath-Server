import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function serverRoutes(fastify: FastifyInstance) {  
  fastify.get("/ping", async(req: FastifyRequest, rep: FastifyReply) => {
    return rep.status(200).send({ message: "pong" })
  })

}