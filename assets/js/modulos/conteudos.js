import { primeiroNome } from "./utilitarios.js"

const alerts = {
  sem_registros: `<div class="alert alert-secondary text-center">Não foram encontrados registros</div>`,
  alerta_impressao: `<div class="alert alert-warning mt-3 d-flex align-items-center justify-content-between">
  Recomendamos que você desabilite a exibição de cabeçalho e rodapé no documento que será impresso ou salvo.
  <button class="btn btn-sm btn-secondary" data-action="confirma-visualizacao-alerta">OK</button>
  </div>`
}

const registro = ({id, nome, data_hora}) => {
  return `<tr data-identificacao=${id}><td>${primeiroNome(nome)}</td><td>${formatoHorario(data_hora)}</td><td><button class="btn btn-primary btn-sm" data-action="recuperar-registro" data-toggle="tooltip" data-placement="bottom" title="Recuperar o registro" onclick="recuperarRegistro(event, this)"><i class="bi bi-arrow-counterclockwise"></i></button>&nbsp;<button class="btn btn-danger btn-sm" data-action="apagar-registro" data-toggle="tooltip" data-placement="bottom" title="Apagar o registro" onclick="apagarRegistro(event, this)"><i class="bi bi-x-lg"></i></button></td></tr>`
}

function formatoHorario(datetime){
  const data_hora = moment(datetime);
  return `${data_hora.format('DD/MM/YYYY - hh:mm')}`
}

const tabela_ultimos_registros = (id) => {
  return `<table class="table table-page-${id} ${id !== 0 ? 'none' : ''}"><thead><tr><th>1º proponente</th><th>Salvo em</th><th>Ações</th></tr></thead><tbody></tbody></table>`;
} 

const principal = `
<header class="container mb-5 mt-2">
<section class="header-principal">
  <div>
    <!-- <button class="btn btn-secondary" data-action="carregar-espelho"><i class="bi bi-file-earmark-arrow-up"></i>Carregar com espelho</button> -->
    <button class="btn btn-secondary" data-action="editar-informacoes"><i class="bi bi-pencil-square"></i>Editar informações</button>
    <button class="btn btn-primary" data-action="imprimir-capa"><i class="bi bi-printer-fill"></i>Imprimir capa</button>
    </div>
    <div>
    <button class="btn btn-secondary" data-action="baixar-capas-armazenadas" data-toggle="tooltip" data-placement="bottom" title="Baixar capas"><i class="bi bi-file-earmark-arrow-down"></i></button>
    <button class="btn btn-secondary" data-action="limpar-tudo" data-toggle="tooltip" data-placement="bottom" title="Limpar tudo"><i class="bi bi-arrow-counterclockwise"></i></button>
    <button class="btn btn-secondary" data-action="enviar-para-ateste" data-toggle="tooltip" data-placement="bottom" title="Enviar para Ateste"><small>-></small>&nbsp;<i class="bi bi-journal-medical"></i></button>
    <button class="btn btn-primary" data-action="copiar-titulo-processo" data-toggle="tooltip" data-placement="bottom" title="Copiar título do processo"><i class="bi bi-123"></i></button>
    <button class="btn btn-primary" data-action="copiar-nome-capa" data-toggle="tooltip" data-placement="bottom" title="Copiar nome da capa"><i class="bi bi-fonts"></i></button>
    <button class="btn btn-primary" data-action="exibir-ultimos-registros" data-toggle="tooltip" data-placement="bottom" title="Exibir últimos registros"><i class="bi bi-card-list"></i></button>
  </div>
</section>
</header>

<main id="capa">
<div class="principal container">
  <section class="container-esquerda">
    <img src="./assets/img/logo-caixa.png" alt="">
  </section>
  <section class="container-direita">
    <div class="grupo" id="identificacao-processo">
      <div id="proponente-1">
        <b><span>Título</span> <span data-element-paste="nome_1">[Nome do proponente]</span></b><br>
        <b><span>CPF</span><span data-element-paste="CPF_1">123.456.789-09</span></b><br><br>
      </div>
      
      <div id="proponente-2">
        <b data-element-paste="nome_2">[Nome do proponente]</b><br>
        <b><span>CPF</span><span data-element-paste="CPF_2">123.456.789-09</span></b><br><br>
      </div>
      <span data-element-paste="modalidade">[Modalidade]</span>
    </div>
    <div class="grupo">
      <div id="identificacao-imovel">
        <b><span>Assunto/Referência</span></b><span data-element-paste="n_contrato">[N.º do contrato]</span><br><br>
        <b><span>Imóvel</span></b><span data-element-paste="endereco">[Endereço do imóvel]</span><br><br>
        <div id="campo-empreendimento"><b><span>Empreendimento</span></b><span data-element-paste="empreendimento">[Empreendimento]</span><br><br></div>
      </div>
      
      <div id="valores-imovel">
        <b><span>Valor de Compra e Venda</span></b><span data-element-paste="valor_compra_e_venda">R$ 0.000,00</span><br>
        <b><span>Valor de Financiamento</span></b><span data-element-paste="valor_financiamento">R$ 0.000,00</span><br>
        <b><span>Recursos Próprios</span></b><span data-element-paste="recursos_proprios">R$ 0.000,00</span><br>
        <b><span>Taxas de cartório</span></b><span data-element-paste="taxa_de_cartorio">R$ 0.000,00</span><br>
        <b><span>FGTS</span></b><span data-element-paste="FGTS">R$ 0,00</span><br>
        <b><span>Subsídio</span></b><span data-element-paste="subsidio">R$ 0,00</span><br><br>
      </div>
      
      <table class="tabela-propostas-comerciais">
        <tbody>
          <tr>
            <th colspan="5">Propostas Comerciais</th>
          </tr>
          <tr>
            <td><span class="checkbox-proposta" checked="false" data-element-paste="comercial_conta_corrente"></span></td>
            <td colspan="3">
              <span>Conta Corrente</span>
              <!-- <span data-element-paste="conta_agencia"></span>.<span data-element-paste="conta_operacao"></span>.<span data-element-paste="conta_numero"></span> -->
            </td>
          </tr>
          <tr>
            <td><span class="checkbox-proposta" checked="false" data-element-paste="comercial_conta_poupanca"></span></td>
            <td colspan="3">
              <span>Conta Poupança</span>
              <!-- <span data-element-paste="conta_agencia"></span>.<span data-element-paste="conta_operacao"></span>.<span data-element-paste="conta_numero"></span> -->
            </td>
          </tr>
          <tr>
            <td><span class="checkbox-proposta" checked="false" data-element-paste="comercial_cartao_de_credito"></span></td>
            <td colspan="3">Cartão de Crédito</td>
          </tr>
          <tr>
            <td><span class="checkbox-proposta" checked="false" data-element-paste="comercial_cheque_especial"></span></td>
            <td>Cheque Especial</td>
            <td><span type="checkbox" class="checkbox-proposta" checked="false" data-element-paste="comercial_credito_consignado"></span></td>
            <td>Crédito Consignado</td>
          </tr>
        </tbody>
      </table><br>
      
      <table class="tabela-dados-bancarios">
        <thead>
          <tr>
            <th colspan="3"><b><span>Conta do comprador</span></b></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <!-- <td><b><span>Conta</span></b><span data-element-paste="conta_numero">00000-0</span></td>
              <td><b><span>Operação</span></b><span data-element-paste="conta_operacao">000</span></td>
              <td><b><span>Agência</span></b><span data-element-paste="conta_agencia">0000</span></td> -->
              
              <td><b><span>Conta</span></b><span data-element-paste="conta_comprador_numero">00000-0</span></td>
              <td><b><span>Operação</span></b><span data-element-paste="conta_comprador_operacao">000</span></td>
              <td><b><span>Agência</span></b><span data-element-paste="conta_comprador_agencia">0000</span></td>
            </tr>
          </tbody>
        </table><br>
        
        <table class="tabela-dados-bancarios" id="dados-bancarios-vendedor">
          <thead>
            <tr>
              <th colspan="3"><b><span>Conta do vendedor</span></b><span class="no-bold" data-element-paste="conta_vendedor_banco"></span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b><span>Conta</span></b><span data-element-paste="conta_vendedor_numero">00000-0</span></td>
              <td><b><span>Operação</span></b><span data-element-paste="conta_vendedor_operacao">000</span></td>
              <td><b><span>Agência</span></b><span data-element-paste="conta_vendedor_agencia">0000</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="grupo-footer">
        <span></span>
        <img src="./assets/img/logo-png.png" alt="">
      </div>
    </section>
  </div>
</main>

<footer class="container mt-5 mb-5">    
  <address>
    <a href="" data-link="github-dev">
      Desenvolvido por <b>Gabriel Ribeiro</b>
    </a>
    <div>
      <button class="btn btn-secondary" data-action="exportar-dados"><i class="bi bi-file-arrow-down"></i>Exportar</button>
      <a href="" data-link="github-dev" data-toggle="tooltip" data-placement="top" title="Github"><i class="bi bi-github"></i></a>
      <a href="" data-link="link-outros-projetos" data-toggle="tooltip" data-placement="top" title="Outros projetos"><i class="bi bi-pc-display"></i></a>
    </div>
  </address> 
</footer>
`
export const conteudos = {
  alerts,
  registro,
  tabela_ultimos_registros,
  principal
}