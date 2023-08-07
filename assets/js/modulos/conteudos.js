import { primeiroNome } from "./utilitarios.js"

const alerts = {
  sem_registros: `<div class="alert alert-secondary text-center">Não foram encontrados registros</div>`,
  alerta_impressao: `<div class="alert alert-warning mt-3 d-flex align-items-center justify-content-between">
  Recomendamos que você desabilite a exibição de cabeçalho e rodapé no documento que será impresso ou salvo.
  <button class="btn btn-sm btn-outline-secondary" data-action="confirma-visualizacao-alerta">OK</button>
  </div>`
}

const registro = ({id, nome, data_hora}) => {
  return `<tr data-identificacao=${id}><td>${primeiroNome(nome)}</td><td>${formatoHorario(data_hora)}</td><td><button class="btn btn-primary btn-sm" data-action="recuperar-registro" data-toggle="tooltip" data-placement="bottom" title="Recuperar o registro" onclick="recuperarRegistro(event, this)"><i class="bi bi-arrow-counterclockwise"></i></button>&nbsp;<button class="btn btn-danger btn-sm" data-action="apagar-registro" data-toggle="tooltip" data-placement="bottom" title="Apagar o registro" onclick="apagarRegistro(event, this)"><i class="bi bi-x-lg"></i></button></td></tr>`
}

function formatoHorario(datetime){
  const data_hora = moment(datetime);
  return `${data_hora.format('DD/MM/YYYY - hh:mm')}`
}

const tabela_ultimos_registros = `<table class="table"><thead><tr><th>1º proponente</th><th>Salvo em</th><th>Ações</th></tr></thead><tbody></tbody></table>`;

export const conteudos = {
  alerts,
  registro,
  tabela_ultimos_registros
}