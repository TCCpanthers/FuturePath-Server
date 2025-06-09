import fastifyCors from "@fastify/cors";
import { fastify } from "fastify";
import dotenv from "dotenv";
import { routes } from "./routes/index.js";

dotenv.config()

const app = fastify({ logger: true })

const server = async () => {
  await app.register(fastifyCors)
  await app.register(routes)
  
  const SERVER_HOST = process.env.HTTP_HOST
  const SERVER_PORT = process.env.HTTP_PORT

  await app.listen({
    host: String(SERVER_HOST),
    port: Number(SERVER_PORT),
  }).then(() => {
    console.log(`[SERVER] Servidor HTTP rodando na porta ${SERVER_PORT}`)
  }).catch((error) => {
    console.log(`[ERROR] Erro ao iniciar o servidor HTTP => ${error}`)
    process.exit(1)
  })
}

server()