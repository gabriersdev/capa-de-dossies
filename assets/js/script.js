"use strict";

import { SwalAlert, isEmpty, sanitizarString, tooltips, zeroEsquerda, verificarCPF } from './modulos/utilitarios.js';
let form_alt = false;

setTimeout(() => {
  $('#modal-editar-informacoes').modal('show');
}, 500);

(() => {  
  document.querySelectorAll('[data-recarrega-pagina]').forEach(botao => {
    botao.addEventListener('click', () => {
      window.location.reload();
    })
  })
  
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
          $(input).mask('000.000.000-00');
          $(input).on('input', (evento) => {
            if(verificarCPF(evento.target.value)){
              $(evento.target.closest('.area-validation-CPF').querySelector('.icon-invalid-CPF')).fadeOut(500);
            }else{
              $(evento.target.closest('.area-validation-CPF').querySelector('.icon-invalid-CPF')).fadeIn(500);
            }
          })
          break;
          
          case 'numero-contrato':
          $(input).mask('0.0000.0000000-0')
          break;
          
          case 'data':
          $(input).mask('00/00/0000');
          break;
          
          case 'agencia':
          $(input).mask('0000', {reverse: true});
          break;
          
          case 'operacao':
          $(input).mask('0000', {reverse: true});
          break;
          
          case 'conta':
          $(input).mask('00000000-0', {reverse: true});
          break;
          
          case 'conta-vendedor':
          $(input).mask('0000000000000-0', {reverse: true});
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
        $(input).mask('00000-0', {reverse: true});
        break;
      }
    }
  }
  
  // $('#modal-editar-informacoes').modal('show');
  setTimeout(() => {
    // document.querySelector('#modal-editar-informacoes').querySelectorAll('input')[0].focus();
  }, 500)
  
  const prepararImpressao = () => {
    $('header').hide();
    $('footer').hide();
    $('#modal-editar-informacoes').modal('hide');
    const numero = sanitizarString($('[data-element-paste="n_contrato"]').text());
    document.title = !isEmpty(numero) && !isNaN(parseInt(numero)) ? `Processo N.º ${numero}` : 'Capa para Processos Habitacionais';
    $('.tabela-propostas-comerciais .checkbox-proposta').each((indice, elemento) => {
      elemento.setAttribute('show', elemento.getAttribute('checked'))
    })
  }
  
  const sairImpressao = () => {
    $('.tabela-propostas-comerciais .checkbox-proposta').each((indice, elemento) => {
      elemento.setAttribute('show', null)
    })
    document.title = 'Capa para Processos Habitacionais';
    $('header').show();
    $('footer').show();
  }

  function atribuirAcoes(){
    const acoes = document.querySelectorAll('[data-action]');
    acoes.forEach(acao => {
      switch(acao.dataset.action.toLowerCase().trim()){
        case 'editar-informacoes':
        $(acao).on('click', () => {
          $('#modal-editar-informacoes').modal('show');
          setTimeout(() => {
            document.querySelector('#modal-editar-informacoes').querySelectorAll('input')[0].focus();
          }, 500)
        })
        break;
        
        case 'imprimir-capa':
        $(acao).on('click', () => {
          if(form_alt){
            prepararImpressao()
            window.print();
            sairImpressao();
          }else{
            SwalAlert('error', 'error', 'Os dados do processo não foram preenchidos ou não foram enviados', null, 'X9102 - Impressão', null, false);
          }
        })
        break;
        
        case 'carregar-espelho':
          $(acao).on('click', () => {
            SwalAlert('aviso', 'error', 'Desculpe, essa função ainda não foi implementada!');
          })
        break;
        
        case 'formulario-informacoes':
        const modal = acao.closest('.modal');
        $(acao).on('submit', (evento) => {
          evento.preventDefault();
          try{
            // console.log('Concluindo');
            
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
            
            inputs_form.forEach(input => {
              acao.closest('form').querySelector(`#${input}`).value
              const capa = document.querySelector('#capa');
              
              const elemento_modal = acao.closest('form').querySelector(`#${input}`);
              const elemento_capa = capa.querySelector(`[data-element-paste="${input}"]`)
              
              if(input == 'comercial_conta_corrente' || input == 'comercial_cheque_especial' || input == 'comercial_conta_poupanca' || input == 'comercial_cartao_de_credito' || input == 'comercial_credito_consignado' /* input == 'conta_agencia' || input == 'conta_operacao' || input == 'conta_numero' */ ){
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
                  $('#empreendimento').hide();
                }else{
                  $('#empreendimento').show();
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
                elemento_capa.textContent = elemento_modal.value.trim();
              }
            });
            
            $(modal).modal('hide');
            form_alt = true;
          }catch(error){
            console.log('Ocorreu um erro! %s', error);
            SwalAlert('error', 'error', 'Ocorreu um erro ao enviar o formulário', null, 'X7260 - Formulário', null, false);
          }
        })
        break;
        
        default:
        throw new Error('Ação não implementada para a ação informada.');
        break;
      }
    })
  }
  
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
  
  const dados_bancarios = document.querySelectorAll('[data-element="dados-bancarios"]');
  dados_bancarios.forEach(dados => {
    dados.querySelectorAll('input').forEach(inputx => {
      $(inputx).on('keypress', (evento) => {
        evento.target.setAttribute('data-mascara', inputx.getAttribute('data-param'));
        // console.log('aqui - evento');
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
          // console.log('Não é um array');
          const valor_tratado = valor.replaceAll('.', '').replaceAll('-', '');
          
          if(valor_tratado.length >= 13){
            const dados = {agencia: valor_tratado.substr(0, 4), operacao: valor_tratado.substr(4, 3), conta: valor_tratado.substr(7, 6)};
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
        // 1111.111.11111-1
        
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
      // console.log('Antes de imprimir...');
      prepararImpressao()
    };
    
    var afterPrint = function() {
      // console.log('Depois de imprimir...');
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

  window.addEventListener("load", function () {
    const overlay2 = document.querySelector(".overlay-2");
    overlay2.style.display = "none";
    atribuirLinks();
    atribuirAcoes();
    atribuirMascaras();
    tooltips();
    
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
    
  });
})();