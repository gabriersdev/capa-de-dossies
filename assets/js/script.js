"use strict";

import { isEmpty, tooltips, zeroEsquerda } from './modulos/utilitarios.js';

setTimeout(() => {
  // $('#modal-editar-informacoes').modal('show');
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
  
  function atribuirMascaras(){
    document.querySelectorAll('[data-mascara]').forEach(input => {
      switch(input.dataset.mascara.trim().toLowerCase()){
        case 'cpf':
        $(input).mask('000.000.000-00');
        break;
        
        case 'data':
        $(input).mask('00/00/0000');
        break;
        
        case 'agencia':
        $(input).mask('0000');
        break;
        
        case 'operacao':
        $(input).mask('0000');
        break;
        
        case 'conta':
        $(input).mask('00000-0');
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
  }
  
  $('#modal-editar-informacoes').modal('show');
  setTimeout(() => {
    document.querySelector('#modal-editar-informacoes').querySelectorAll('input')[0].focus();
  }, 500)

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
          $('footer').hide();
          // document.title = '12345678909';
          window.print();
          document.title = 'Document';
          $('footer').show();
        })
        break;
        
        case 'carregar-espelho':
        break;

        case 'formulario-informacoes':
          $(acao).on('submit', (evento) => {
            evento.preventDefault();
            console.log('Concluindo')
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
        const input_conta = input.closest('.input-group').querySelector('input[data-mascara="conta"]');
        
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
        atribuirMascaras();
        
        input_agencia.focus();
      }, 0);
    })
    
    inputs[i].addEventListener('keypress', (evento) => {
      evento.target.setAttribute('data-mascara', evento.target.getAttribute('data-param'));
      atribuirMascaras();
    })
    
    i++;
  }
  
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