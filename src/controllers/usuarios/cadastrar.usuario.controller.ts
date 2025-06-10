import { FastifyReply, FastifyRequest } from "fastify"

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
    
    if (/^(\d)\1+$/.test(cpfFormatado)){
      return false
    }
    
    const digitos = cpfFormatado.split('').map(Number)
    
    const primeiroDigito = this.calcularDigitoVerificador(digitos.slice(0, 9), 10)
    const segundoDigito = this.calcularDigitoVerificador(digitos.slice(0, 10), 11)

    return primeiroDigito === digitos[9] && segundoDigito === digitos[10]
  }

  public async handle(req: FastifyRequest, rep: FastifyReply) {
    const cpf = "285.506.488-09"
    
    if (!this.validarCPF(cpf)) {
      return rep.status(400).send({ message: "CPF Inválido" })
    }
    
    return rep.status(200).send({ message: "CPF Válido" })
  }
}