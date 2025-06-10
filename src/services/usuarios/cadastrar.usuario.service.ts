import { prisma } from "../../config/prisma.config.js";
import { Usuario } from "../../types/tipagem.usuario.js";

export class CadastrarUsuarioService {
  async execute({ nome, cpf, senha }: Pick<Usuario, 'nome' | 'cpf' | 'senha'>) {

    const cpfEstaCadastrado = await prisma.usuarios.count({
      where: {
        cpf,
      }
    })

    if (cpfEstaCadastrado > 0) {
      throw new Error("Este CPF já está em uso.")
    }

    await prisma.usuarios.create({
      data: {
        nome,
        cpf,
        senha,
      }
    })

  }
}