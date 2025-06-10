import { hash } from "argon2";
import { FastifyReply, FastifyRequest } from "fastify";
import yup from "yup";
import { CadastrarUsuarioService } from "../../services/usuarios/cadastrar.usuario.service.js";

export class CadastrarUsuarioController {

  private calcularDigitoVerificador(digitos: number[], pesoInicial: number): number {
    const soma = digitos.reduce((acumulativo, digito, index) => {
      return acumulativo + digito * (pesoInicial - index)
    }, 0)

    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }

  private validarCPF(cpf: string): boolean {
    const cpfFormatado = cpf.replace(/[^\d]+/g, '')

    if (cpfFormatado.length !== 11) {
      return false
    }

    if (/^(\d)\1+$/.test(cpfFormatado)) {
      return false
    }

    const digitos = cpfFormatado.split('').map(Number)

    const primeiroDigito = this.calcularDigitoVerificador(digitos.slice(0, 9), 10)
    const segundoDigito = this.calcularDigitoVerificador(digitos.slice(0, 10), 11)

    return primeiroDigito === digitos[9] && segundoDigito === digitos[10]
  }

  public async handle(req: FastifyRequest, rep: FastifyReply) {

    const cadastroSchema = yup.object({
      nome: yup.string()
        .required({ mensagem: "O campo 'nome' é obrigatório." })
        .nonNullable({ mensagem: "O nome não pode ser nulo." })
        .min(2, { mensagem: "O nome deve conter ao menos 2 caracteres." }),
      cpf: yup.string()
        .required({ mensagem: "O campo 'cpf' é obrigatório." })
        .nonNullable({ mensagem: "O cpf não pode ser nulo." })
        .test("cpf-válido", "CPF Inválido.", (value) => {
          if (!value) {
            return false
          }
          return this.validarCPF(value)
        }),
      senha: yup.string()
        .required({ mensagem: "O campo 'senha' é obrigatório." })
        .nonNullable({ mensagem: "A senha não poder ser nula." })
        .min(8, { mensagem: "A senha deve conter ao menos 8 caracteres." })
        .max(36, { mensagem: "A senha deve conter no máximo 36 caracteres." })
    })

    try {
      await cadastroSchema.validate(req.body, { abortEarly: false })
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const erros = error.errors.map((err) => ({
          mensagem: err
        }))
        return rep.status(400).send({ mensagem: "Falha na validação dos dados inseridos.", erros })
      }
    }

    const { nome, cpf, senha } = req.body as yup.InferType<typeof cadastroSchema>

    const senhaCriptografada = await hash(senha)

    try {
      const cadastrarUsuarioService = new CadastrarUsuarioService()
      await cadastrarUsuarioService.execute({ nome, cpf, senha: senhaCriptografada })

      return rep.status(201).send({ mensagem: "Usuário Cadastrado com Sucesso" })
    } catch (error: any) {
      return rep.status(400).send({ erro: error.message })
    }
  }
}