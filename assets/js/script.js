"use strict";

import { conteudos } from './modulos/conteudos.js';
import { Settings } from './classes/Settings.js';
import { SwalAlert, isEmpty, sanitizarString, tooltips, popovers, zeroEsquerda, verificarCPF, copiar, sanitizarNumero, criarEBaixarArquivo, range, verificarFuncionalidadeAteste } from './modulos/utilitarios.js';
import { getData } from './modulos/funcoes.js';
let form_alt = false;
let CPF_ok = new Array();
let configs = {};

// setTimeout(() => $('#modal-confirm-rec').modal('show'), 500);

(() => {  
  document.querySelectorAll('[data-recarrega-pagina]').forEach(botao => {
    botao.addEventListener('click', () => {
      window.location.reload();
    })
  })
  
  const inputs_form = [
    'nome_1', 
    'CPF_1', 
    'nome_2', 
    'CPF_2', 
    'modalidade', 
    'n_contrato', 
    'endereco', 
    'empreendimento', 
    'valor_compra_e_venda', 
    'valor_financiamento', 
    'recursos_proprios', 
    'FGTS', 
    'subsidio', 
    'taxa_de_cartorio',
    'comercial_conta_corrente', 
    'comercial_cheque_especial', 
    'comercial_conta_poupanca', 
    'comercial_cartao_de_credito', 
    'comercial_credito_consignado',
    // 'conta_agencia', 
    // 'conta_operacao', 
    // 'conta_numero', 
    'conta_comprador_agencia', 
    'conta_comprador_operacao', 
    'conta_comprador_numero', 
    'conta_vendedor_banco', 
    'conta_vendedor_agencia', 
    'conta_vendedor_operacao', 
    'conta_vendedor_numero'
  ]
  
  const inputs_formulario = {
    nome_1: '', 
    CPF_1: '', 
    nome_2: '', 
    CPF_2: '', 
    modalidade: '', 
    n_contrato: '', 
    endereco: '', 
    empreendimento: '', 
    valor_compra_e_venda: '', 
    valor_financiamento: '', 
    recursos_proprios: '', 
    FGTS: '', 
    subsidio: '', 
    comercial_conta_corrente: '', 
    comercial_cheque_especial: '', 
    comercial_conta_poupanca: '', 
    comercial_cartao_de_credito: '', 
    conta_agencia: '', 
    conta_operacao: '', 
    conta_numero: '', 
    conta_comprador_agencia: '', 
    conta_comprador_operacao: '', 
    conta_comprador_numero: '', 
    conta_vendedor_banco: '', 
    conta_vendedor_agencia: '', 
    conta_vendedor_operacao: '', 
    conta_vendedor_numero
  }
  
  const masks = [
    {input_id: 'CPF', mask: '000.000.000-00'},
    {input_id: 'numero-contrato', mask: '0.0000.0000000-0'},
    {input_id: 'data', mask: '00/00/0000'},
    {input_id: 'agencia', mask: '0000'},
    {input_id: 'operacao', mask: '0000'},
    {input_id: 'conta', mask: '000000000000-0'},
    {input_id: 'conta-vendedor', mask: '000000000000-0'},
    {input_id: 'codigo-cca', mask: '000000000'},
  ]
  
  function atribuirLinks(){
    const linkElementos = document.querySelectorAll('[data-link]');
    
    linkElementos.forEach(link => {
      switch(link.dataset.link.toLowerCase().trim()){        
        case 'github-dev':
        link.href = 'https://github.com/gabrieszin';
        break;
        
        case 'github-projeto':
        link.href = 'https://github.com/gabrieszin/[nome-repositorio]';
        break;
        
        case 'link-outros-projetos':
        link.href = 'https://github.com/gabrieszin?tab=repositories';
        break;
        
        default:
        throw new Error('Ação não implementada para o link informado.');
        break;
      }
      
      link.setAttribute('rel', 'noopener noreferrer');
      link.setAttribute('target', '_blank');
    })
  }
  
  function atribuirMascaras(param, input){
    if(isEmpty(param) && isEmpty(input)){
      document.querySelectorAll('[data-mascara]').forEach(input => {
        switch(input.dataset.mascara.trim().toLowerCase()){
          case 'cpf':
          $(input).mask(masks.filter(e => e.input_id == 'CPF')[0].mask);
          $(input).on('input', (evento) => {
            if(verificarCPF(evento.target.value)){
              $(evento.target.closest('.area-validation-CPF').querySelector('.icon-invalid-CPF')).fadeOut(500);
            }else{
              $(evento.target.closest('.area-validation-CPF').querySelector('.icon-invalid-CPF')).fadeIn(500);
            }
          })
          break;
          
          case 'numero-contrato':
          $(input).mask(masks.filter(e => e.input_id == 'numero-contrato')[0].mask)
          break;
          
          case 'data':
          $(input).mask(masks.filter(e => e.input_id == 'data')[0].mask);
          break;
          
          case 'agencia':
          $(input).mask(masks.filter(e => e.input_id == 'agencia')[0].mask, {reverse: true});
          break;
          
          case 'operacao':
          $(input).mask(masks.filter(e => e.input_id == 'operacao')[0].mask, {reverse: true});
          break;
          
          case 'conta':          
          case 'conta-vendedor':
          $(input).mask(masks.filter(e => e.input_id == 'conta')[0].mask, {reverse: true});
          break;
          
          case 'money':
          SimpleMaskMoney.setMask(input, {
            prefix: 'R$ ',
            fixed: true,
            fractionDigits: 2,
            decimalSeparator: ',',
            thousandsSeparator: '.',
            cursor: 'end'
          });
          input.removeAttribute('maxlength');
          break;
          
          case 'codigo-cca':
          $(input).mask(masks.filter(e => e.input_id == 'codigo-cca')[0].mask, {reverse: true});
          break;
          
          default:
          throw new Error('Ação não implementada para o link informado.');
          break;
        }
      })
    }else{
      switch(param.toLowerCase().trim()){
        case 'agencia':
        $(input).mask('0000', {reverse: true});
        break;
        
        case 'operacao':
        $(input).mask('0000', {reverse: true});
        break;
        
        case 'conta':
        $(input).mask('000000000000-0', {reverse: true});
        break;
      }
    }
  }
  
  const prepararImpressao = () => {
    CPF_ok = new Array();
    const campos_CPF = $('[data-mascara="CPF"]');
    
    campos_CPF.each((index, campo) => {
      !isEmpty(campo.value) ? verificarCPF(campo.value.trim()) ? CPF_ok.push(true) : CPF_ok.push(false) : '';
    })
    
    if(!CPF_ok.every(e => e == true)){
      SwalAlert('aviso', 'error', 'Um ou mais CPFs informados está inválido');
    }else{
      $('header').hide();
      $('footer').hide();
      $('#modal-editar-informacoes').modal('hide');
      const numero = sanitizarString($('[data-element-paste="n_contrato"]').text());
      document.title = !isEmpty(numero) && !isNaN(parseInt(numero)) ? `Processo N.º ${numero}` : 'Capa para Processos Habitacionais';
      $('.tabela-propostas-comerciais .checkbox-proposta').each((indice, elemento) => {
        elemento.setAttribute('show', elemento.getAttribute('checked'))
      })
    }
    
  }
  
  const sairImpressao = () => {
    $('.tabela-propostas-comerciais .checkbox-proposta').each((indice, elemento) => {
      elemento.setAttribute('show', null)
    })
    document.title = 'Capa para Processos Habitacionais';
    $('header').show();
    $('footer').show();
  }
  
  const exibirModalEditarInformacoes = () => {
    $('#modal-editar-informacoes').modal('show');
    setTimeout(() => {
      document.querySelector('#modal-editar-informacoes').querySelectorAll('input')[0].focus();
    }, 500)
  }
  
  function atribuirAcoes(acao, evento_acao){
    const acoes = document.querySelectorAll('[data-action]');
    
    if(acao){
      Array.from(acoes).filter((a) => a.dataset.action == acao)[0].addEventListener(evento_acao, (evento) => {
        evento.preventDefault();
        removerLogoCCA(evento);
      })
      return;
    }
    
    acoes.forEach(acao => {
      switch(acao.dataset.action.toLowerCase().trim()){
        case 'editar-informacoes':
        $(acao).on('click', () => {
          exibirModalEditarInformacoes();
        })
        break;
        
        case 'imprimir-capa':
        $(acao).on('click', () => {
          if(form_alt){
            prepararImpressao()
            window.print();
            sairImpressao();
          }else{
            SwalAlert('error', 'error', 'Os dados do processo não foram preenchidos ou não foram enviados', null, 'X9102 - Impressão', null, false, null);
          }
        })
        break;
        
        case 'copiar-titulo-processo':
        $(acao).on('click', (evento) => {
          
          if(!form_alt){
            SwalAlert('error', 'error', 'Os dados do processo não foram preenchidos ou não foram enviados', null, 'X9103 - Cópia título do processo', null, false, null);
          }else if(!verificarCPF(document.querySelector('#CPF_1').value)){
            SwalAlert('aviso', 'error', 'O CPF informado para o 1º proponente está inválido');
          }else{
            // TODO : Adicionar configuração para informar número do CCA
            const nome = `${configs["codigo-cca"]}_${(document.querySelector('#modal-editar-informacoes').querySelectorAll('[data-mascara="CPF"]')[0].value.replace(/\d/g, ''))}_${(document.querySelector('#modal-editar-informacoes').querySelector('[data-mascara="numero-contrato"]').value.replace(/\d/g, ''))}_PR`;
            
            copiar(nome).then(retorno => {
              const botao = $('[data-action="copiar-titulo-processo"]');
              botao.disabled = true;
              
              botao.html('<i class="bi bi-check2"></i>');
              botao.removeClass('btn-primary');
              botao.addClass('btn-success');
              
              setTimeout(() => {
                botao.disabled = false;
                botao.html(`<i class="bi bi-123"></i>`);
                botao.addClass('btn-primary');
                botao.removeClass('btn-success');
              }, 1000);
              
              // Exibir modal com o título do processo - não exibindo
              if(document.querySelector('.div-flutuante')){
                $('.div-flutuante input#div-flutuante--dado').val(nome);
                // $('.div-flutuante').show(); 
              }
              
            }).catch((error) => {
              SwalAlert('aviso', 'error', 'Não foi possível copiar o título do processo', `Erro: ${error.message}`)
            });
          }
        })
        break;
        
        case 'copiar-nome-capa':
        $(acao).on('click', (evento) => {
          evento.preventDefault();
          const numero = sanitizarString($('#n_contrato').val());
          const nome_capa = !isEmpty(numero) && !isNaN(parseInt(numero)) ? `Processo N.º ${numero}` : '';
          if(!isEmpty(nome_capa) && !isEmpty(numero)){
            copiar(nome_capa).then(retorno => {
              const botao = $('[data-action="copiar-nome-capa"]');
              botao.disabled = true;
              
              botao.html('<i class="bi bi-check2"></i>');
              botao.removeClass('btn-primary');
              botao.addClass('btn-success');
              
              setTimeout(() => {
                botao.disabled = false;
                botao.html(`<i class="bi bi-fonts"></i>`);
                botao.addClass('btn-primary');
                botao.removeClass('btn-success');
              }, 1000);
            }).catch((error) => {
              SwalAlert('aviso', 'error', 'Não foi possível copiar o nome da capa', `Erro: ${error.message}`)
            });
          }else{
            SwalAlert('aviso', 'error', 'Preencha os dados do processo para gerar o nome da capa');
          }
        })
        break;
        
        case 'exportar-dados':
        $(acao).on('click', () => {
          try{
            let armazenadas = JSON.parse(localStorage.getItem('ultimos-registros'));
            
            if(armazenadas !== null && Array.isArray(armazenadas) && armazenadas.length > 0){
              SwalAlert('confirmacao', 'question', 'Deseja baixar um arquivo JSON com os registros?', null, null, 'Sim', false, null).then(({isConfirmed}) => {
                if(isConfirmed){
                  const data = new Date().toLocaleDateString("pt-BR").match("(?<day>[0-9]{2})\/(?<month>[0-9]{2})\/(?<year>[0-9]{4})").groups;
                  
                  // Gera arquivo e baixa JSON com os dados
                  criarEBaixarArquivo(JSON.stringify(armazenadas), `Registros Armazenados ${data.day}.${data.month}.${data.year} ${new Date().toLocaleTimeString("pt-BR").replaceAll(':', '.')}`, 'json');
                }else{
                  // Exibe no console
                  SwalAlert('aviso', 'success', 'Registros exportados listados no console', null, null, null, false, 3000);
                  console.groupCollapsed('Registros armazenados.');
                  console.info(JSON.stringify(armazenadas));
                  console.groupEnd();
                }
              })
            }else{
              SwalAlert('aviso', 'warning', 'Não há registros armazenados. Crie uma capa primeiro.', null, null, null, false, 3000);
              console.info('Não há registros armazenados.');            
            }
            
          }catch(error){
            SwalAlert('aviso', 'warning', 'Não há registros armazenados', null, null, null, false, 3000);
            console.info('Não há registros armazenados.');
          }
        });
        break;
        
        case 'exibir-ultimos-registros':
        $(acao).on('click', (evento) => {
          evento.preventDefault();
          atualizarRegistros();
        })
        break;
        
        case 'enviar-para-ateste':
        $(acao).on('click', (evento) => {
          if(verificarFuncionalidadeAteste('action')){
            evento.preventDefault();
            const elementos = ['nome_1', 'nome_2', 'CPF_1', 'CPF_2', 'modalidade', 'n_contrato', 'empreendimento', 'comercial_conta_corrente', 'comercial_cheque_especial', 'comercial_conta_poupanca', 'comercial_cartao_de_credito', 'comercial_credito_consignado', 'conta_comprador_agencia', 'conta_comprador_operacao', 'conta_comprador_numero'];
            
            const elementos_substituicao = {
              comercial_cartao_de_credito: 'c_credito',
              comercial_cheque_especial: 'cheque',
              comercial_conta_corrente: 'conta_corrente',
              comercial_conta_poupanca: 'conta_poupanca',
              comercial_credito_consignado: 'consignado'
            }
            
            const saida = new Array();
            
            elementos.forEach((elemento) => {
              const input = document.querySelector(`#${elemento}`);
              
              if(input !== null && ((input.type == 'checkbox' && input.checked) || !isEmpty(input.value))){
                switch(elemento){
                  case 'comercial_conta_corrente':
                  case 'comercial_conta_poupanca':
                  case 'comercial_cheque_especial':
                  case 'comercial_cartao_de_credito':
                  case 'comercial_credito_consignado':
                  if(input.checked){
                    saida.push(`${elementos_substituicao[elemento]}=${!isEmpty(sanitizarNumero(input.value)) ? sanitizarNumero(input.value) : input.checked}`)
                    if(elemento == 'comercial_conta_corrente' || elemento == 'comercial_conta_poupanca'){
                      const prefixo = elemento == 'comercial_conta_corrente' ? 'cc' : 'cp';
                      saida.push(`${prefixo + '_numero'}=${sanitizarNumero($('#conta_comprador_numero').val())}`)
                      saida.push(`${prefixo + '_operacao'}=${sanitizarNumero($('#conta_comprador_operacao').val())}`)
                      saida.push(`${prefixo + '_agencia'}=${sanitizarNumero($('#conta_comprador_agencia').val())}`)
                    }
                  }
                  break;
                  
                  case 'CPF_1':
                  case 'CPF_2':
                  case 'n_contrato':
                  if(!isEmpty(input.value)){
                    saida.push(`${elemento}=${sanitizarNumero(input.value)}`)
                  }
                  break;
                  
                  case 'modalidade':
                  if(input.value == 'Pró-cotista'){
                    saida.push(`${elemento}=PROCOTISTA`);
                  }else{
                    saida.push(`${elemento}=${input.value.replaceAll(' ', '-')}`)
                  }
                  break;
                  
                  default:
                  if(input.getAttribute('type') == 'text' && !isEmpty(input.value) || 
                  input.getAttribute('type') == 'checkbox' && !input.checked == false ||
                  input.getAttribute('type') == 'radio' && !input.checked == false){
                    if(!isEmpty(input.value)){
                      saida.push(`${elemento}=${input.getAttribute('type') == 'text' ? input.value.replaceAll(' ', '-') : input.getAttribute('type') == 'checkbox' || input.getAttribute('type') == 'radio' ? input.checked : ''}`)
                    }
                  }
                  break;
                }
                
              }
            })
            
            if(!isEmpty(saida)){
              window.open(`https://gabrieszin.github.io/ateste-processo?${saida.join('&')}`)
            }else{
              SwalAlert('aviso', 'error', 'Necessário preencher ao menos um campo para criar o Ateste');
            }
          }
        })
        break;
        
        case 'limpar-registros-salvos':
        const modal_utlimos = document.querySelector('#modal-ultimos-registros-salvos');
        $(acao).on('click', (evento) => {
          SwalAlert('confirmacao', 'question', 'Tem certeza que deseja apagar os registros?', 'Isso é irreversível', null, 'Sim', true, null).then((retorno) => {
            if(retorno.isConfirmed){
              try{
                localStorage.setItem('ultimos-registros', '');
                SwalAlert('aviso', 'success', 'Registros apagados com sucesso');
              }catch(error){
                console.warn('Falha ao apagar registros salvos', 'Error: 2021LA');
                SwalAlert('aviso', 'warning', 'Falha ao apagar registros salvos');
              }
              modal_utlimos.querySelector('.modal-body').innerHTML = conteudos.alerts.sem_registros
            }
          });
        })
        break;
        
        case 'formulario-informacoes':
        $(acao).on('submit', (evento) => {
          evento.preventDefault();
          
          const ok = verificarInputsCPFValidos();
          
          if(ok.every(e => e == true)){
            const registro = enviarFormulario(acao);
            if(!isEmpty(registro)){
              salvarRegistro(registro)
            };
          }else{
            SwalAlert('aviso', 'error', 'Um ou mais CPF informado está inválido');
          }
        })
        break;
        
        case 'confirma-visualizacao-alerta':
        // Ação implementada através de função a parte.
        break;
        
        case 'baixar-capas-armazenadas':
        $(acao).click(() => {
          criarEBaixarArquivo(JSON.stringify(localStorage.getItem('ultimos-registros')), `BACKUP - ${Date.now()}`, 'txt')
        })
        break;
        
        case 'limpar-tudo':
        $(acao).click(() => {
          window.location.reload();
        })
        break;
        
        case 'form-logo-cca':
        case 'form-outras-configs':
        $(acao).on('submit', (evento) => {
          evento.preventDefault();
          alterarConfiguracoes(evento.target);
        })
        break;
        
        case 'remover-logo-cca':
        $(acao).click((evento) => removerLogoCCA(evento));
        break;
        
        case 'acessar-configs':
        $(acao).on('click', (evento) => {
          evento.preventDefault();
          atualizarConfiguracoes();
          $('#modal-configuracoes').modal('show');
        })
        break;
        
        case 'ver-primeiro-logo-cca':
        $(acao).click((evento) => {
          evento.preventDefault();
          const input = document.querySelector('#config-logo-cca');
          
          // Verificando se o input com a logo do CCA foi preenchido com uma imagem
          try{
            $('[data-action="ver-primeiro-logo-cca"]').removeClass('button-disabled');
            
            if(input.files[0]){
              const image = new FileReader();
              image.readAsDataURL(input.files[0]);
              
              image.addEventListener('loadend', (eIMG) => {
                eIMG.preventDefault();
                $('#logo-cca').prop('src', eIMG.target.result);
              })
              
              $('#modal-configuracoes').modal('hide');
              setTimeout(() => {
                $('.modo-visualizacao').show();
              }, 300);
              
              // Desativando ações na página
              $('#content').css('pointer-events', 'none');
              $('#modais').css('pointer-events', 'none');
              
              // Evento de escuta da ação
              $('[data-sub-action="desfazer"]').click((e) =>{
                e.preventDefault();
                atualizarConfiguracoes();
                closeVisualization();
              });
              
              $('[data-sub-action="confirmar"]').click((e) =>{
                e.preventDefault();
                // Enviando para alteração
                alterarConfiguracoes(document.querySelector('[data-action="form-logo-cca"]'));
                closeVisualization();
              });
              
              function closeVisualization(){
                // Reativando ações na página
                $('#content').css('pointer-events', 'initial');
                $('#modais').css('pointer-events', 'initial');
                
                // Removendo manipulação dos botões
                $('[data-sub-action="desfazer"]').unbind();
                $('[data-sub-action="confirmar"]').unbind();
                
                // Ocultando div do modo
                $('.modo-visualizacao').hide();
              }
            }else{
              // Necessário preencher o input
              input.closest('form').querySelector('[type="submit"]').click();
            }
          }catch(error){
            $('[data-action="ver-primeiro-logo-cca"]').addClass('button-disabled');
          }
        });
        break;
        
        case 'fechar-div-flutuante':
        $(acao).click((evento) => {
          $(evento.target.closest('div.div-flutuante')).hide();
        })
        break;
        
        case 'fechar-modo-visualizacao':
        $(acao).click((evento) => {
          $(evento.target.closest('div.modo-visualizacao')).hide();
        })
        break;
        
        case 'importar-com-espelho':
        $(acao).click((evento) => {
          evento.preventDefault();
          const input = document.querySelector('#import-arquivo-espelho');
          // Por padrão, se o input já estiver preenchido o mesmo arquivo não será importado novamente, por isso essa verificação e limpeza para permitir a importação do mesmo arquivo
          if (input.files.length === 0) {
            input.click();
          } else {
            input.value = '';
            input.click();
          }
        });
        break;
        
        case 'input-import-arquivo-espelho':
        // Dados de exemplo - para teste
        const data = {
          "proponentes": {
            "nome": [
              "JOSE DA SILVA",
              "MARIA JOSE",
            ],
            "CPF": [
              "123.456.789-09",
              "123.456.789-09",
            ]
          },
          "modalidade": "NPMCMV",
          "contrato": "8.7857.0000138-0",
          "endereco": "RUA X",
          "empreendimento": "CONQUISTA ALVORADA"
          ,
          "valores": {
            "valor_compra_e_venda": 
            "224.000,00"
            ,
            "valor_financiamento": 
            "175.200,00"
            ,
            "recursos_proprios": 
            "45.780,62"
            ,
            "FGTS": 
            "1.222,38"
            ,
            "subsidio": 
            "1.797,00"
            ,
            "taxas_de_cartorio": 
            "0,00"
          },
          "conta_debito": {
            "banco": "104",
            "agencia": "0001",
            "operacao": "1234",
            "conta": "000581752157",
            "digito": "6"
          },
          "conta_deposito": {
            "banco": "104",
            "agencia": "0001",
            "operacao": "1234",
            "conta": "000581752157",
            "digito": "6"
          }
        }
        
        $(acao).on('change', (evento) => {
          const arquivo = evento.target.files[0];
          const reader = new FileReader();
          const btn = $('[for="import-arquivo-espelho"]');
          $(btn).addClass('disabled');

          try{
            reader.readAsBinaryString(arquivo);
            reader.onload = (e) => {
              const fileData = e.target.result;
              getData((fileData)).then((data) => {
                if(Array.isArray(data) || Object.getOwnPropertyNames(data).length === 0){
                  SwalAlert('aviso', 'warning', 'Não foi possível recuperar dados do arquivo', 'O arquivo pode não ser um PDF legível ou pode estar corrompido. Retire o espelho outra vez e tente novamente.');
                } else if (Object.getOwnPropertyNames(data).length > 0){
                  console.log('Here!');
                  
                  const modal = $('#modal-confirm-rec')[0];

                  document.querySelector('#modal-editar-informacoes [type=reset]').click();
                  modal.querySelectorAll('input').forEach(input => ['checkbox', 'radio'].includes(input.type) ? input.checked = false : input.value = '');

                  const naoRecuperado = [];
                  // Exibindo modal de confirmação dos dados de importação
                  // $('#modal-confirm-rec').modal('show');
                  
                  if (data.valores && Object.getOwnPropertyNames(data.valores).length > 0) {
                    const osvalores = ['valor_compra_e_venda', 'valor_financiamento', 'recursos_proprios', 'FGTS', 'subsidio', 'taxa_de_cartorio']
                    
                    if (JSON.stringify(osvalores.sort()) !== JSON.stringify(Object.getOwnPropertyNames(data.valores).sort())) naoRecuperado.push('Valores da operação');
                    
                    for (let i = 0; i < Object.getOwnPropertyNames(data.valores).length; i++){
                      const val = data.valores[Object.getOwnPropertyNames(data.valores)[i]];
                      $(`#${Object.getOwnPropertyNames(data.valores)[i]}`).val(val.length > 0 ? `R$ ${val}` : 'R$ 0,00');
                    }
                  } else {
                    naoRecuperado.push('Valores da operação');
                  }
                  
                  if (data.conta_debito && Object.getOwnPropertyNames(data.conta_debito).length > 0) {
                    const osdados = ['banco', 'agencia', 'operacao', 'conta', 'digito'];
                    
                    if (JSON.stringify(osdados.sort()) !== JSON.stringify(Object.getOwnPropertyNames(data.conta_debito).sort())) naoRecuperado.push('Dados bancários');
                    
                    for (let i = 0; i < Object.getOwnPropertyNames(data.conta_debito).length; i++){
                      if (['conta', 'digito'].includes(Object.getOwnPropertyNames(data.conta_debito)[i])){
                        $(`#conta_comprador_numero`).val(`${data.conta_debito['conta']}-${data.conta_debito['digito']}`);
                      } else {
                        $(`#conta_comprador_${Object.getOwnPropertyNames(data.conta_debito)[i]}`).val(data.conta_debito[Object.getOwnPropertyNames(data.conta_debito)[i]]);
                      }
                    }
                  } else {
                    naoRecuperado.push('Dados bancários');
                  }
                  
                  if (data.conta_deposito && Object.getOwnPropertyNames(data.conta_deposito).length > 0) {
                    const osdados = ['banco', 'agencia', 'operacao', 'conta', 'digito'];
                    
                    // Verificando se os dados bancários são iguais e se as propriedades obtidas são as mesmas que deveriam
                    if (JSON.stringify(osdados.sort()) === JSON.stringify(Object.getOwnPropertyNames(data.conta_deposito).sort())){
                      if (JSON.stringify(data.conta_deposito) === JSON.stringify(data.conta_debito)){
                        // Se os dados bancários de débito e depósito são iguais, então não é um processo individual
                        document.querySelector('label[for="op-nao-individual"]').click();
                        // TODO - Separar variáveis pra evitar múltiplas chamadas
                        document.querySelector('label[for="op-nao-individual"]').click(); 
                        // Marcando operação conta corrente
                        document.querySelector('label[for="prod-1"]').click(); 
                      } else {
                        // Se os dados bancários de débito e depósito são diferentes, então é um processo individual
                        document.querySelector('label[for="op-sim-individual"]').click();
                        // TODO - Separar variáveis pra evitar múltiplas chamadas
                        document.querySelector('label[for="op-sim-individual"]').click();
                        // Marcando operação conta corrente
                        document.querySelector('label[for="prod-1"]').click(); 
                        
                        for (let i = 0; i < Object.getOwnPropertyNames(data.conta_deposito).length; i++){
                          if (['conta', 'digito'].includes(Object.getOwnPropertyNames(data.conta_deposito)[i])){
                            $(`#conta_vendedor_numero`).val(`${data.conta_deposito['conta']}-${data.conta_deposito['digito']}`);
                          } else {
                            $(`#conta_vendedor_${Object.getOwnPropertyNames(data.conta_deposito)[i]}`).val(data.conta_deposito[Object.getOwnPropertyNames(data.conta_deposito)[i]]);
                          }
                        }
                      }
                    }else{
                      naoRecuperado.push('Dados bancários')
                    };
                  } 
                  
                  if (data.modalidade) {
                    if (data.modalidade.length !== 0){
                      // Preencher
                      $('#modalidade').val(Array.isArray(data.modalidade) ? data.modalidade[0] : data.modalidade);
                    } else if (data.modalidade.length == 0){
                      naoRecuperado.push('Identificação da unidade e proposta');
                    }
                  } else {
                    naoRecuperado.push('Identificação da unidade e proposta');
                  }
                  
                  if (data.contrato) {
                    if (data.contrato.length !== 0){
                      // Preencher
                      $('#n_contrato').val(Array.isArray(data.contrato) ? data.contrato[0] : data.contrato);
                    } else if (data.contrato.length == 0){
                      naoRecuperado.push('Identificação da unidade e proposta');
                    }
                  } else {
                    naoRecuperado.push('Identificação da unidade e proposta');
                  }
                  
                  if (data.endereco) {
                    if (data.endereco.length !== 0){
                      // Preencher
                      $('#endereco').val(Array.isArray(data.endereco) ? data.endereco[0] : data.endereco);
                    } else if (data.endereco.length == 0){
                      naoRecuperado.push('Identificação da unidade e proposta');
                    }
                  } else {
                    naoRecuperado.push('Identificação da unidade e proposta');
                  }
                  
                  if (data.empreendimento) {
                    const [ naoIndividual, simIndividual ] = Array.from(document.querySelectorAll("[name='op-tipo']")).map((e) => e.closest('li.list-group-item').querySelector('label'));          
                    
                    if (data.empreendimento.length !== 0){
                      // Preencher
                      $('#empreendimento').val(Array.isArray(data.empreendimento) ? data.empreendimento[0] : data.empreendimento);
                      naoIndividual.click();
                    } else if (data.empreendimento.length == 0){
                      simIndividual.click()
                      naoRecuperado.push('Identificação da unidade e proposta');
                    }
                  } else {
                    document.querySelector('label[for="op-sim-individual"]').click()
                    naoRecuperado.push('Identificação da unidade e proposta');
                  }
                  
                  // Regras para preencher os campos com o que foi recuperado do arquivo
                  if (data.proponentes.nome && Array.isArray(data.proponentes.nome)) {
                    const area = $('[data-element="confirm-nome-prop"]');
                    if (data.proponentes.nome.length > 2) {
                      // Criar seleção para proponentes
                      $(area).show();
                      $(area).find('.list-group').empty();
                      data.proponentes.nome.toSpliced(5).filter((e, i) => data.proponentes.nome.indexOf(e) === i).toSorted((a, b) => a.localeCompare(b)) .forEach((nome, index) => {
                        $(area).find('.list-group').append(`<li class="list-group-item"><input type="checkbox" class="form-check-input" name="nome-prop-${index}" id="nome-prop-${index}" data-e-target="${nome}"><label for="nome-prop-${index}">${nome}</label></li>`);
                      });
                      naoRecuperado.push('Identificação dos proponentes');
                    } else if (data.proponentes.nome.length == 0) {
                      $(area).hide();
                      naoRecuperado.push('Identificação dos proponentes');
                    } else {
                      $(area).hide();
                      // Preencher
                      data.proponentes.nome.forEach((nome, index) => {
                        $(`#nome_${index + 1}`).val(nome);
                      });
                    }
                  } else {
                    $('[data-element="confirm-nome-prop"]').hide();
                    naoRecuperado.push('Identificação dos proponentes');
                  }
                  
                  if (data.proponentes.CPF) {
                    const area = $('[data-element="confirm-CPF-prop"]');
                    if (data.proponentes.CPF.length > 2) {
                      // Criar seleção para CPF
                      $(area).show();
                      $(area).find('.list-group').empty();
                      data.proponentes.CPF.toSpliced(5).filter((e, i) => data.proponentes.CPF.indexOf(e) === i).toSorted((a, b) => a.localeCompare(b)) .forEach((CPF, index) => {
                        $(area).find('.list-group').append(`<li class="list-group-item"><input type="checkbox" class="form-check-input" name="CPF-prop-${index}" id="CPF-prop-${index}" data-e-target="${CPF}"><label for="CPF-prop-${index}">${CPF}</label></li>`);
                      });
                      naoRecuperado.push('Identificação dos proponentes');
                    } else if (data.proponentes.CPF.length == 0) {
                      $(area).hide();
                      naoRecuperado.push('Identificação dos proponentes');
                    } else {
                      $(area).hide();
                      // Preencher
                      data.proponentes.CPF.forEach((CPF, index) => {
                        $(`#CPF_${index + 1}`).val(CPF);
                      });
                    }
                  } else {
                    $('[data-element="confirm-CPF-prop"]').hide();
                    naoRecuperado.push('Identificação dos proponentes');
                  }
                  
                  // Verificando o que não foi possível recuperar e exibindo em tela
                  const resNaoRecuperado = naoRecuperado.filter((el, e) => naoRecuperado.indexOf(el) === e);
                  const areaNaoRecuperado = $('[data-element="not-nao-recuperado"]');
                  if (resNaoRecuperado.length > 0) {
                    // Preencher
                    // TODO - Exibir de forma mais elegante
                    // $(areaNaoRecuperado).show();
                    $(areaNaoRecuperado).attr('class', 'tab-pane fade');
                    $(areaNaoRecuperado).find('.list-group').empty();
                    resNaoRecuperado.forEach((item, index) => {
                      $(areaNaoRecuperado).find('.list-group').append(`<li class="list-group-item">${item}</li>`);
                    });
                  } else {
                    $(areaNaoRecuperado).find('.list-group').empty();
                    $(areaNaoRecuperado).attr('class', 'none');
                    // TODO - Ocultar de forma mais elegante
                    // $(areaNaoRecuperado).hide();
                  }
                  
                  $(`.nav-tabs .nav-link[data-bs-target="#nav-pass-1"]`).tab('show');
                  $(modal).find('.modal-footer [data-confirm-rec]').remove();
                  $(modal).find('.modal-footer [onclick]').remove();
                  $(modal).find('.modal-footer').append(`<button class="btn btn-primary" onclick="proxContent(0, this)">Continuar</button>`);
                  $(modal).modal('show');
                }

                $(btn).removeClass('disabled');
              })
              .catch((error) => {
                $(btn).removeClass('disabled');
                SwalAlert('aviso', 'error', 'Erro ao importar arquivo', `Verifique o console.`);
                console.info(error.message);
              });
            }
            reader.onerror = (e) => {
              $(btn).removeClass('disabled');
              SwalAlert('aviso', 'error', 'Erro ao importar arquivo', `Verifique o console.`);
              console.info(e.message);
            }
          }catch(error){
            // 
            $(btn).removeClass('disabled');
          }
        })
        break;
        
        default:
        throw new Error('Ação não implementada para a ação informada.');
        break;
      }
    })
  }
  
  function alterarConfiguracoes(form){
    try{
      const button = {class: form.querySelector('button[type=submit]').classList.value, text: form.querySelector('button[type=submit]').innerText}
      const inputs = Array.from(form.querySelectorAll('input'));
      let send = null;
      const returns = new Array();
      const arraySend = new Array();
      
      inputs.forEach((input) => {
        switch(input.type.toLowerCase()){
          case 'checkbox':
          case 'radio':
          send = input.checked;
          arraySend.push({send: send, input: input});
          break;
          case 'file':
          
          if(input.files[0]){
            const image = new FileReader();
            image.readAsDataURL(input.files[0]);
            
            image.addEventListener('loadend', (evento) => {
              send = JSON.stringify({value: input.files[0].name, file: evento.target.result});
              
              if(sendOptionValue(send, input)){
                $('#logo-cca').prop('src', evento.target.result);
              }else{
                $('#logo-cca').prop('src', './assets/img/logo-teste.png');
              };
            })
            
            return send;
          }
          break;
          
          case 'text':
          send = input.value;
          arraySend.push({send: send, input: input});
          break;
          
          default:
          // send = input.value;
          // arraySend.push({send: send, input: input});
          break;
        }
      })
      
      arraySend.length > 0 ? sendOptionValue(null, null, arraySend) : "";
      //TODO: em caso de erro, limpar o registro
      
      function sendOptionValue(send, input, array){
        if(array){
          if(array.length > 0){
            array.forEach((option) => {
              const ret = new Settings().setOption(option.input.name.toLowerCase().match("(?<config>[a-z]+)\-(?<name>[a-z-\-]+)").groups["name"], option.send);
              
              returns.push(!isEmpty(ret) && ret === option.send);
            })
          }
        }else{
          if(!isEmpty(send)){ 
            const ret = new Settings().setOption(input.name.toLowerCase().match("(?<config>[a-z]+)\-(?<name>[a-z-\-]+)").groups["name"], send);
            
            returns.push(!isEmpty(ret) && JSON.parse(ret).value === JSON.parse(send).value);
          }else{
            console.log('Input vazio');
          }
        }
        
        if(returns.every((r) => r) && !isEmpty(returns)){
          // 'Alterado com sucesso!'
          feedback(form.querySelector('button[type=submit]'), button, {class: 'mt-3 btn btn-success', text: 'Alterado!'});
          atualizarConfiguracoes();
          verificarFuncionalidadeAteste();
          return true;
        }else{
          console.log('Não houve alteração. Retorno vazio ou diferente do enviado.');
          feedback(form.querySelector('button[type=submit]'), button, {class: 'mt-3 btn btn-danger', text: 'Ocorreu um erro!'});
          return false;
        }
      }
      
    }catch(error){
      console.log(error)
      console.log("Algo de errado ocorreu. Erro: %s", error);
    }
  }
  
  function feedback(e, original, update){
    e.setAttribute('class', `${update.class} button-disabled`);
    e.innerText = update.text;
    
    setTimeout(() => {
      e.setAttribute('class', original.class);
      e.innerText = original.text;
    }, 1500);
  }
  
  function removerLogoCCA(evento){
    try{
      new Settings().CRUDoption("update", "logo-cca", "#");
      evento.target.closest('div.input-group').remove();
      atualizarConfiguracoes();
    }catch(error){
      //
    }
  }
  
  function enviarFormulario(acao){
    let registro = new Object();
    const modal = acao.closest('.modal');
    
    try{
      inputs_form.forEach(input => {
        acao.closest('form').querySelector(`#${input}`).value
        const capa = document.querySelector('#capa');
        
        const elemento_modal = acao.closest('form').querySelector(`#${input}`);
        const elemento_capa = capa.querySelector(`[data-element-paste="${input}"]`)
        
        if(['comercial_conta_corrente', 'comercial_cheque_especial', 'comercial_conta_poupanca', 'comercial_cartao_de_credito', 'comercial_credito_consignado'].includes(input)){
          elemento_capa.setAttribute('checked', elemento_modal.checked);
        }else if(input == 'nome_2' || input == 'CPF_2'){
          if(isEmpty(elemento_modal.value)){
            $('#proponente-2').hide();
          }else{
            $('#proponente-2').show();
            elemento_capa.textContent = elemento_modal.value.trim();
          }
        }else if(input == 'empreendimento'){
          if(isEmpty(elemento_modal.value)){
            $('#campo-empreendimento').hide();
          }else{
            $('#campo-empreendimento').show();
            elemento_capa.textContent = elemento_modal.value.trim();
          }
        }else if(input == 'conta_vendedor_banco' || input == 'conta_vendedor_agencia' || input == 'conta_vendedor_numero'){
          if(isEmpty(elemento_modal.value)){
            $('#dados-bancarios-vendedor').hide();
          }else{
            $('#dados-bancarios-vendedor').show();
            elemento_capa.textContent = elemento_modal.value.trim();
          }
        }
        else{
          if(elemento_modal.value.trim() !== 'R$ 0,00'){
            elemento_capa.textContent = elemento_modal.value.trim();
          }else{
            elemento_capa.textContent = '';
          }
        }
        
        if(['CPF_1', 'CPF_2', 'n_contrato', 'conta', 'conta-vendedor'].includes(input)){
          let input_value = elemento_modal.value;
          input_value = input_value.match(/\d/g);
          registro[input] = input_value;
        }else{
          registro[input] = elemento_modal.value;
        }
      });
      
      $(modal).modal('hide');
      form_alt = true;
      
    }catch(error){
      console.log('Ocorreu um erro! %s', error);
      SwalAlert('error', 'error', 'Ocorreu um erro ao enviar o formulário', null, 'X7260 - Formulário', null, false);
    }
    
    return registro;
  }
  
  function salvarRegistro(registro){
    const ultimos_registros = localStorage.getItem('ultimos-registros');
    registro['datetime'] = Date.now();
    
    try{
      if(ultimos_registros !== null && !isEmpty(ultimos_registros)){
        if(!isEmpty(JSON.parse(ultimos_registros)) && Array.isArray(JSON.parse(ultimos_registros))){
          const array = JSON.parse(ultimos_registros);
          array.push(registro);
          localStorage.setItem('ultimos-registros', JSON.stringify(array));
        }else{
          localStorage.setItem('ultimos-registros', JSON.stringify([registro]));
        }
      }else{
        localStorage.setItem('ultimos-registros', JSON.stringify([registro]));
      }
    }catch(error){
      localStorage.setItem('ultimos-registros', JSON.stringify([registro]));
    }
  }
  
  function verificarInputsCPFValidos(){
    let ok = new Array();
    
    if(!isEmpty(document.querySelector('#CPF_1').value)){
      if(verificarCPF(document.querySelector('#CPF_1').value)){
        ok.push(true);
      }else{
        ok.push(false);
      }
    }
    
    if(!isEmpty(document.querySelector('#CPF_2').value)){
      if(verificarCPF(document.querySelector('#CPF_2').value)){
        ok.push(true);
      }else{
        ok.push(false);
      }
    }
    
    return ok;
  }
  
  const dados_bancarios = document.querySelectorAll('[data-element="dados-bancarios"]');
  dados_bancarios.forEach(dados => {
    dados.querySelectorAll('input').forEach(inputx => {
      $(inputx).on('keypress', (evento) => {
        evento.target.setAttribute('data-mascara', inputx.getAttribute('data-param'));
        try{
          atribuirMascaras(inputx.getAttribute('data-param'), inputx)
        }catch{}
      })
    })
  })
  
  document.querySelectorAll('input[type=checkbox]').forEach(elemento => {
    elemento.setAttribute('value', elemento.checked);
    elemento.addEventListener('change', () => {
      elemento.setAttribute('value', elemento.checked);
    })
  })
  
  document.querySelectorAll('input[type=radio]').forEach(elemento => {
    elemento.setAttribute('value', elemento.checked);
    elemento.addEventListener('change', () => {
      elemento.setAttribute('value', elemento.checked);
    })
  })
  
  const inputs = document.querySelectorAll('input[data-param="agencia"]');
  let i = 0;
  
  while(i < inputs.length){
    inputs[i].addEventListener('paste', (evento) => {
      setTimeout(() => {
        const input = evento.target;
        const valor = input.value;
        const split = (valor.trim().split('.'));
        
        const input_agencia = input.closest('.input-group').querySelector('input[placeholder="0000"]');
        const input_operacao = input.closest('.input-group').querySelector('input[data-mascara="operacao"]');
        const input_conta = input.closest('.input-group').querySelector('input[data-mascara="conta"]') || input.closest('.input-group').querySelector('input[data-mascara="conta-vendedor"]');
        
        if(Array.isArray(split) && split.length > 1){
          if(split[0].trim().length >= 4){
            input_agencia.value = split[0].trim();
            // input_agencia.focus();
          }
          if(split[1].length >= 3){
            input_operacao.value = split[1].trim();
            // input_operacao.focus();
          }
          if(split[2].length >= 5){
            input_conta.value = split[2].trim();
            // input_conta.focus();
          }
        }else{
          const valor_tratado = valor.match(/\d/g);
          
          if(valor_tratado.length >= 13){
            const dados = {agencia: valor_tratado.substr(0, 4), operacao: valor_tratado.substr(4, 3), conta: valor_tratado.substr(7, valor.length)};
            
            if(!isEmpty(dados.agencia)){
              input_agencia.value = dados.agencia;
              // input_agencia.focus();
            }
            if(!isEmpty(dados.operacao)){
              input_operacao.value = dados.operacao;
              // input_operacao.focus();
            }
            if(!isEmpty(dados.conta)){
              input_conta.value = dados.conta;
              // input_conta.focus();
            }
          }
        }
        
        evento.target.setAttribute('data-mascara', input.getAttribute('data-param'));
        atribuirMascaras(input.getAttribute('data-param'));
        
        input_agencia.focus();
      }, 0);
    })
    
    inputs[i].addEventListener('keypress', (evento) => {
      evento.target.setAttribute('data-mascara', evento.target.getAttribute('data-param'));
      atribuirMascaras(evento.target.getAttribute('data-param'), inputs[i]);
    })
    
    i++;
  }
  
  (function() {
    var beforePrint = function() {
      prepararImpressao()
    };
    
    var afterPrint = function() {
      sairImpressao()
    };
    
    if (window.matchMedia) {
      var mediaQueryList = window.matchMedia('print');
      mediaQueryList.addListener(function(mql) {
        if (mql.matches) {
          beforePrint();
        } else {
          afterPrint();
        }
      });
    }
    
    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;
  }());
  
  let index_registro = 0;
  
  function atualizarRegistros(){
    const modal_ultimos = document.querySelector('#modal-ultimos-registros-salvos');
    $(modal_ultimos).modal('show');
    // Variável de controle de indexação dos elementos
    index_registro = 0;
    
    try{
      const ultimos_registros = localStorage.getItem('ultimos-registros');
      const nav_pagination = document.querySelector('.nav-pagination');
      
      if(!isEmpty(ultimos_registros) && ultimos_registros !== null && Array.isArray(JSON.parse(ultimos_registros)) && JSON.parse(ultimos_registros).length > 0){
        modal_ultimos.querySelector('.modal-body').innerHTML = '';
        nav_pagination.classList.remove('none');
        
        const itens = 10;
        const quantidade_paginas = Math.ceil(JSON.parse(ultimos_registros).length / itens);
        
        if(quantidade_paginas <= 0){
          nav_pagination.querySelector('ul').innerHTML = `<li class="page-item"><a data-navigation-page="0" class="page-link active">1</a></li>`;
          
          modal_ultimos.querySelector('.modal-body').innerHTML += conteudos.tabela_ultimos_registros(index);
          
          JSON.parse(ultimos_registros).toSorted((a, b) => b.datetime - a.datetime).splice(index * itens, itens).forEach((registro) => {
            modal_ultimos.querySelector(`.modal-body .table-page-${index} tbody`).innerHTML += conteudos.registro({id: index_registro, nome: registro.nome_1, data_hora: registro.datetime});
            // Incrementando variável de controle
            index_registro++;
          })
          
        }else{
          range({max: quantidade_paginas}).forEach((index) => {
            if(index === 0){
              nav_pagination.querySelector('ul').innerHTML = `<li class="page-item"><a data-navigation-control="${index}" class="page-link active">${index + 1}</a></li>`;
            }else{
              nav_pagination.querySelector('ul').innerHTML += `<li class="page-item"><a data-navigation-control="${index}" class="page-link">${index + 1}</a></li>`;
            }
            
            modal_ultimos.querySelector('.modal-body').innerHTML += conteudos.tabela_ultimos_registros(index);
            
            JSON.parse(ultimos_registros).toSorted((a, b) => b.datetime - a.datetime).splice(index * itens, itens).forEach((registro) => {
              modal_ultimos.querySelector(`.modal-body .table-page-${index} tbody`).innerHTML += conteudos.registro({id: index_registro, nome: registro.nome_1, data_hora: registro.datetime});
              // Incrementando variável de controle
              index_registro++;
            })
          })
          
        }
        
        $('[data-navigation-control]').on('click', (event) => {
          const id = event.target.dataset.navigationControl;
          $(`[data-navigation-control]`).removeClass('active');
          $(`[data-navigation-control="${id}"]`).addClass('active');
          $(`#modal-ultimos-registros-salvos .modal-body .table`).hide();
          $(`#modal-ultimos-registros-salvos .modal-body .table.table-page-${id}`).show();
        })
        
        tooltips();
      }else if(JSON.parse(ultimos_registros).length <= 0){
        sem_registros();
        nav_pagination.classList.add('none')
      }else{
        sem_registros();
        nav_pagination.classList.add('none')
      };
    }catch(error){
      sem_registros();
    }
    
    function sem_registros(){
      modal_ultimos.querySelector('.modal-body').innerHTML = conteudos.alerts.sem_registros;
    }
  }
  
  function apagarRegistro(evento, elemento){
    evento.preventDefault();
    const id = evento.target.closest('[data-identificacao]').dataset.identificacao;
    
    if(!isEmpty(id) && typeof parseInt(id) == 'number'){
      
      SwalAlert('confirmacao', 'question', 'Tem certeza que deseja apagar o registro?', 'Isso é irreversível', null, 'Sim', true, null).then((retorno) => {
        if(retorno.isConfirmed){
          try{
            const ultimos_registros = localStorage.getItem('ultimos-registros');
            
            if(!isEmpty(ultimos_registros) && ultimos_registros !== null && Array.isArray(JSON.parse(ultimos_registros))){
              const array = new Array();
              
              JSON.parse(ultimos_registros).toSorted((a, b) => b.datetime - a.datetime).forEach((elemento, index) => {
                if(index !== parseInt(id)){
                  array.push(elemento);
                }
              })
              
              $(evento.target).tooltip('dispose');
              evento.target.closest('[data-identificacao]').remove()
              $(evento.target).tooltip('hide');
              tooltips();
              
              localStorage.setItem('ultimos-registros', JSON.stringify(array));
              atualizarRegistros();
            }
          }catch(error){
            SwalAlert('aviso', 'error', 'Falha ao apagar o registro selecionado');
            console.warn('Falha ao apagar o registro selecionado.', 'Error: 6098RG');
          } 
        }
      })
    }else{
      SwalAlert('aviso', 'error', 'Erro ao capturar o identificador do registro');
      console.warn('Erro ao capturar o identificador do registro.', 'Erro: 7878KR');
    }
  }
  
  function recuperarRegistro(evento, elemento){
    evento.preventDefault();
    const modal = $('#modal-ultimos-registros-salvos');
    const id = evento.target.closest('[data-identificacao]').dataset.identificacao;
    
    if(!isEmpty(id) && typeof parseInt(id) == 'number'){
      try{
        const ultimos_registros = localStorage.getItem('ultimos-registros');
        
        if(!isEmpty(ultimos_registros) && ultimos_registros !== null && Array.isArray(JSON.parse(ultimos_registros))){
          const dados_recuperados = JSON.parse(localStorage.getItem('ultimos-registros')).toSorted((a, b) => b.datetime - a.datetime)[id];
          const modal_informacoes = document.querySelector('#modal-editar-informacoes');
          
          Object.keys(dados_recuperados).forEach(key => {
            const input = modal_informacoes.querySelector(`#${key}`);
            if(input !== null){
              if(key == 'comercial_conta_corrente' || key == 'comercial_cheque_especial' || key == 'comercial_conta_poupanca' || key == 'comercial_cartao_de_credito' || key == 'comercial_credito_consignado' /* key == 'conta_agencia' || key == 'conta_operacao' || key == 'conta_numero' */ ){
                input.checked = dados_recuperados[key] == 'false' || dados_recuperados[key] == false ? false : true;
              }else{
                switch(key){
                  case 'CPF_1':
                  case 'CPF_2':
                  input.value = new StringMask(masks.filter(e => e.input_id == 'CPF')[0].mask, {reverse: true}).apply(sanitizarNumero(dados_recuperados[key]));
                  break;
                  
                  case 'n_contrato':
                  input.value = new StringMask(masks.filter(e => e.input_id == 'numero-contrato')[0].mask, {reverse: true}).apply(sanitizarNumero(dados_recuperados[key]));
                  break;
                  
                  case 'conta':
                  case 'conta-vendedor':
                  input.value = new StringMask(masks.filter(e => e.input_id == 'conta')[0].mask, {reverse: true}).apply(sanitizarNumero(dados_recuperados[key]));
                  break;
                  
                  default:
                  input.value = dados_recuperados[key];
                  break;
                }
              }
            }
          })
          
          // modal_informacoes.querySelector('button[type=submit]');
          modal.modal('hide');
          // $(evento.target.closest('[data-toggle="tooltip"]')).tooltip('dispose');
          SwalAlert('aviso', 'success', 'Registro recuperado com sucesso!', null, null, null, null, 3000);
          
          if(verificarInputsCPFValidos().every(e => e == true)){
            enviarFormulario(document.querySelector('[data-action="formulario-informacoes"]'));
          }else{
            SwalAlert('aviso', 'error', 'Um ou mais CPF informado está inválido');
          }
        }
      }catch(error){
        SwalAlert('aviso', 'error', 'Falha ao recuperar o registro selecionado');
        console.warn('Falha ao recuperar o registro selecionado.', 'Error: 3612RG', error);
      } 
    }else{
      SwalAlert('aviso', 'error', 'Erro ao capturar o identificador do registro');
      console.warn('Erro ao capturar o identificador do registro.', 'Erro: 4933KR');
    }
  }
  
  window.apagarRegistro = apagarRegistro;
  window.recuperarRegistro = recuperarRegistro;
  
  window.exibirLinkCompartilhamento = (event)  => {
    Swal.fire({
      input: 'url',
      inputLabel: 'Link de compartilhamento',
      inputValue: `${window.location.href}?id=${event.target.closest('[data-identificacao]').dataset.identificacao}`,
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonText: 'Fechar',
      confirmButtonText: 'Copiar',
      inputAttributes: {
        autocapitalize: 'off'
      },
      preConfirm: (url) => {
        if(url){
          navigator.clipboard.writeText(url);
          Swal.fire({
            title: 'Link copiado!',
            icon: 'success',
            timer: 1500
          })
        }
      }
    })
  }
  
  window.addEventListener("load", function () {
    $('body').append(`<div id="content">${conteudos.principal}</div>`)
    
    $('[data-element-paste]').each((index, element) => {
      element.textContent = '';
    })
    
    const overlay2 = document.querySelector(".overlay-2");
    overlay2.style.display = "none";
    
    try{
      const consultaAPIBancos = async () => {
        return await fetch('https://brasilapi.com.br/api/banks/v1')
        .then((retorno) => retorno.json())
        .then((retorno) => retorno)
        .catch((error) => {console.warn('Falha ao requisitar dados bancários da API', 'Error: 1543CN'); null;})
      }
      
      consultaAPIBancos().then(bancos => {
        if(!isEmpty(bancos)){
          const lista = document.querySelector('#lista-bancos');
          bancos.forEach((banco, index) => {
            if(!isEmpty(banco.ispb)){
              const numero = zeroEsquerda(3, banco.code);
              if(!isNaN(parseInt(numero))){
                const option = document.createElement('option');
                option.setAttribute('value', `${numero} - ${banco.name}`);
                lista.appendChild(option);
              }
            }
          })
        }
      })
    }catch(error){
      console.warn('Falha ao requisitar dados bancários da API', 'Error: 1543CN')
    };
    
    try{
      const url = new URL(window.location);
      
      if(!isEmpty(url.search)){
        const parametros = url.search.replace('?', '').split('&');
        const parametros_alteracao = ['CPF_1', 'nome_1', 'CPF_2', 'nome_2', 'modalidade', 'n_contrato'];
        
        if(Array.isArray(parametros)){
          parametros.forEach((parametro) => {
            const parametro_split = parametro.split('=');
            if(parametros_alteracao.includes(parametro_split[0])){
              if(['nome_1', 'nome_2', 'modalidade'].includes(parametro_split[0])){
                $(`#${parametro_split[0]}`).val(desanitizarStringURL(parametro_split[1]));
              }else{
                $(`#${parametro_split[0]}`).val(parametro_split[1]);
              }
            }
          })
          
          exibirModalEditarInformacoes();
        }
      }
      
      function desanitizarStringURL(string){
        if(!isEmpty(string)){
          return string.replaceAll('-', ' ').replaceAll('%20', ' ');
        }else{
          return '';
        }
      }
      
    }catch(error){
      console.warn('Erro ao capturar parâmetros na URL', 'Error: 6907XN')
    }
    
    try{
      const variavel = sessionStorage.getItem('confirma-visualizacao-alerta');
      if(variavel !== null && variavel !== undefined){
        if(!isEmpty(variavel)){
          if(JSON.parse(variavel) !== true){
            $('header.container').append(conteudos.alerts.alerta_impressao);
          }
        }else{
          $('header.container').append(conteudos.alerts.alerta_impressao);
        };
      }else{
        $('header.container').append(conteudos.alerts.alerta_impressao);
      }
      
      $('[data-action="confirma-visualizacao-alerta"]').click(() => {
        try{
          sessionStorage.setItem('confirma-visualizacao-alerta', JSON.stringify(true));
          $('[data-action="confirma-visualizacao-alerta"]').closest('div.alert').remove();
        }catch(error){
          console.log('Ocorreu um erro ao salvar confirmação de visualização de alerta. Erro: %s', error);
        }
      })
      
    }catch(error){
      console.warn('Erro ao verificar variável armazenada', 'Error: 4988XC', error)
    }

    $('#modal-confirm-rec [data-bs-dismiss="modal"]').on('click', function(e){
      console.log('Closing!');
      // Clear inputs and checkboxes of modal-editar-informacoes
      // TODO - Melhorar reset dos inputs
      document.querySelector('#modal-editar-informacoes [type="reset"]').click();
      e.preventDefault();
      $('#modal-confirm-rec').modal('hide');
    });
    
    // Atualizar configurações da capa
    atualizarConfiguracoes();
    
    // Verifica se o CCA definido é o mesmo habilitado para utilizar o ateste
    verificarFuncionalidadeAteste();
    
    // Chamando outras funções
    atribuirLinks();
    atribuirAcoes();
    atribuirMascaras();
    tooltips();
    popovers();
  });
  
  window.addEventListener('DOMContentLoaded', () => {
    if(true){
      window.onbeforeunload = (evento) => {
        if(Array.from($('input:not([type=checkbox], [type=radio], [type=number], #config-codigo-cca)')).filter(e => e.value !== "R$ 0,00" && e.value.trim().length > 0).length > 0){
          // evento.preventDefault();
        }
      }
    }
  })
  
  document.addEventListener('keyup', (evento) => {
    if(!isEmpty(evento.keyCode)){
      if(evento.keyCode == 45){
        //Ativar modal editar informações
        exibirModalEditarInformacoes();
      }else if(evento.keyCode == 113){
        //Ativar modal últimos registros
        atualizarRegistros();
      }
    }
  })
  
  const atualizarConfiguracoes = () => {
    const settings = new Settings();
    const options = settings.getOptionsValues();
    
    //TODO: alterar a funcionalidade, além da visualização
    
    for(let option of Object.entries(options)){
      if(option[0] !== "logo-cca"){
        $(`#config-${option[0]}`).prop(`${option[1]["propertie"]}`, option[1]["values"]);
        
        switch(option[0]){
          case "autocomplete":
          $('input').prop('autocomplete', option[1]["values"] ? "on" : "off");
          break;
          case "exibir-opt-link":
          // TODO: Implementar
          break;
          case "codigo-cca":  
          configs["codigo-cca"] = option[1]["values"];
          break;
        }
      }else{
        if(isEmpty(option[1]["values"])){
          // Exibir o input file para enviar um arquivo
          $('[data-element="logo-cca-selection"]').html(conteudos.preencher_logo_cca);
          
          $('#logo-cca').prop('src', './assets/img/logo-teste.png');
          $('[data-action="ver-primeiro-logo-cca"]').removeClass('button-disabled');
          $('[data-action="form-logo-cca"] button[type="submit"]').removeClass('button-disabled');
        }else{
          const values = JSON.parse(option[1].values);
          // Informar que já existe um arquivo
          $('[data-element="logo-cca-selection"]').html(`<label for="config-logo-cca-exists" class="form-label">Logo do Correspondente</label><span class="text-muted">200x150 px</span><div class="input-group"><input type="text" class="form-control" id="config-logo-cca-exists" name="config-logo-cca-exists" value=${values.value} readonly><button type="button" class="btn btn-light" data-action="remover-logo-cca"><i class="bi bi-x-lg no-margin"></i></button></div>`);
          $('#logo-cca').prop('src', values.file);
          $('[data-action="ver-primeiro-logo-cca"]').addClass('button-disabled');
          $('[data-action="form-logo-cca"] button[type="submit"]').addClass('button-disabled');
          atribuirAcoes("remover-logo-cca", "click");
          tooltips();
        }
      };
    }
  }

  window.proxContent = (index, e) => {
    const tabs = document.querySelectorAll('.nav-tabs .nav-link');
    const tabContents = document.querySelectorAll('.tab-pane');
    e.setAttribute('onclick', 'proxContent(' + (index + 1) + ', this)');
    
    // tabs[index].classList.remove('active');
    // tabs[index].setAttribute('aria-selected', false);
    // tabContents[index].classList.remove('active', 'show');
    
    // tabs[index + 1].classList.add('active');
    // tabs[index + 1].setAttribute('aria-selected', true);
    // tabContents[index + 1].classList.add('active', 'show');
    
    $(`.nav-tabs .nav-link[data-bs-target="#nav-pass-${index + 2}"]`).tab('show');
    
    if(parseInt(index) === tabContents.length - 2){
      // TODO - Tab de confirmação de produtos não aparece no modal após a 1ª vez
      e.removeAttribute('onclick');
      e.setAttribute('data-confirm-rec', 'confirmed');
      e.classList.value = 'btn btn-success';
      e.textContent = 'Finalizar';
      
      $('[data-confirm-rec]').on('click', function(e){
        e.preventDefault();
        
        // Atualizar produtos comerciais selecionados
        Array.from($('[data-element="form-confirm-produtos-comercial"]').find('input[type="checkbox"]')).filter((e) => ['true', 'on', true].includes(e.checked)).forEach((input) => {
          $(input.getAttribute('data-e-target')).prop('checked', true);
        })
        
        // Atualizar nome dos proponentes selecionados
        const confirmNomeProps = document.querySelector('[data-element="confirm-nome-prop"]');
        if (confirmNomeProps.style.display !== 'none') {
          const selectedsNames = Array.from(confirmNomeProps.querySelectorAll('input[type="checkbox"]')).filter((e) => ['true', 'on', true].includes(e.checked)).map((input) => input.dataset.eTarget).toSpliced(2);
          // Preenchendo os campos com os nomes
          selectedsNames.forEach((name, index) => {
            document.querySelector(`#nome_${index + 1}`).value = name.toUpperCase();
          });
        }
        
        // Atualizar CPF dos proponentes selecionados
        const confirmCPFProps = document.querySelector('[data-element="confirm-CPF-prop"]');
        if (confirmCPFProps.style.display !== 'none') {
          const selectedsCPF = Array.from(confirmCPFProps.querySelectorAll('input[type="checkbox"]')).filter((e) => ['true', 'on', true].includes(e.checked)).map((input) => input.dataset.eTarget).toSpliced(2);
          // Preenchendo os campos com os CPFs
          selectedsCPF.forEach((cpf, index) => {
            document.querySelector(`#CPF_${index + 1}`).value = cpf;
          });
        }
        
        $('#modal-confirm-rec').modal('hide');
        document.querySelector('[data-action="editar-informacoes"]').click();
        // alert('Dados confirmados com sucesso!');
      });
    }
  }
  
})();