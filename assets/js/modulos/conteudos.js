import { primeiroNome } from "./utilitarios.js"

const alerts = {
  sem_registros: `<div class="alert alert-secondary text-center">Não foram encontrados registros</div>`
}

const registro = ({id, nome, data_hora}) => {
  return `<tr data-identificacao=${id}><td>${primeiroNome(nome)}</td><td>${data_hora}</td><td><button class="btn btn-primary btn-sm" data-action="recuperar-registro" data-toggle="tooltip" data-placement="bottom" title="Recuperar o registro"><i class="bi bi-arrow-counterclockwise"></i></button>&nbsp;<button class="btn btn-danger btn-sm" data-action="apagar-registro" data-toggle="tooltip" data-placement="bottom" title="Apagar o registro"><i class="bi bi-x-lg"></i></button></td></tr>`
}

export const conteudos = {
  alerts,
  registro
}