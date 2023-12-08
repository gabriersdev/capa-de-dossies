"use strict";

import { conteudos } from './modulos/conteudos.js';
import { SwalAlert, isEmpty, sanitizarString, tooltips, zeroEsquerda, verificarCPF, copiar, sanitizarNumero, criarEBaixarArquivo, range } from './modulos/utilitarios.js';
let form_alt = false;
let CPF_ok = new Array();

setTimeout(() => {
  // $('#modal-editar-informacoes').modal('show');
  // $('#modal-ultimos-registros-salvos').modal('show');
}, 500);

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
      // SwalAlert('aviso', 'warning', 'Um ou mais CPFs informados está inválido', null, null, null, null, 3000);
      
      setTimeout(() => {
        // $('#modal-editar-informacoes').modal('show');
        // $('#modal-editar-informacoes input')[0];
      }, 3000)
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
  
  function atribuirAcoes(){
    const acoes = document.querySelectorAll('[data-action]');
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
            
            setTimeout(() => {
              // $('#modal-editar-informacoes').modal('show'); 
            }, 2000)
          }
        })
        break;
        
        case 'copiar-titulo-processo':
        $(acao).on('click', (evento) => {
          
          if(!form_alt){
            SwalAlert('error', 'error', 'Os dados do processo não foram preenchidos ou não foram enviados', null, 'X9103 - Cópia título do processo', null, false, null);
            
            setTimeout(() => {
              // $('#modal-editar-informacoes').modal('show');
            }, 2000);
          }else if(!verificarCPF(document.querySelector('#CPF_1').value)){
            SwalAlert('aviso', 'error', 'O CPF informado para o 1º proponente está inválido');
          }else{
            copiar(`000637637_${(document.querySelector('#modal-editar-informacoes').querySelectorAll('[data-mascara="CPF"]')[0].value.replace(/\D/g, ''))}_${(document.querySelector('#modal-editar-informacoes').querySelector('[data-mascara="numero-contrato"]').value.replace(/\D/g, ''))}_PR`).then(retorno => {
              const botao = $('[data-action="copiar-titulo-processo"]');
              botao.html('<i class="bi bi-check2"></i>');
              botao.toggleClass('btn-outline-primary');
              botao.toggleClass('btn-success');
              
              setTimeout(() => {
                botao.html(`<i class="bi bi-123"></i>`);
                botao.toggleClass('btn-outline-primary');
                botao.toggleClass('btn-success');
              }, 500)
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
            copiar(nome_capa);
          }else{
            SwalAlert('aviso', 'error', 'Preencha os dados do processo para gerar o nome da capa');
          }
        })
        break;
        
        case 'carregar-espelho':
        $(acao).on('click', () => {
          SwalAlert('aviso', 'error', 'Desculpe, essa função ainda não foi implementada!');
        })
        break;
        
        case 'exportar-dados':
        $(acao).on('click', () => {
          try{
            let armazenadas = JSON.parse(localStorage.getItem('ultimos-registros'));
            let saida = '';
            
            if(armazenadas !== null || Array.isArray(armazenadas)){
              SwalAlert('aviso', 'success', 'Registros exportados listados no console', null, null, null, false, 3000);
              console.groupCollapsed('Registros armazenados.');
              console.info(JSON.stringify(armazenadas));
              console.groupEnd();
            }else{
              SwalAlert('aviso', 'warning', 'Não há registros armazenados', null, null, null, false, 3000);
              console.groupCollapsed('Não há registros armazenados.');
              console.info('Não há registros armazenados.');    
              console.groupEnd();             
            }
            
          }catch(error){
            SwalAlert('aviso', 'warning', 'Não há registros armazenados', null, null, null, false, 3000);
            console.groupCollapsed('Não há registros armazenados.');
            console.info('Não há registros armazenados.');    
            console.groupEnd();      
          }
        });
        break;
        
        case 'exibir-ultimos-registros':
        $(acao).on('click', (evento) => {
          atualizarRegistros();
        })
        break;
        
        case 'enviar-para-ateste':
        $(acao).on('click', (evento) => {
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
        
        default:
        throw new Error('Ação não implementada para a ação informada.');
        break;
      }
    })
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
          [{'.': ''}, {'-': ''}, {' ': ''}].forEach((replace) => {
            input_value = input_value.replaceAll(Object.keys(replace)[0], Object.values(replace)[0]);
          })
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
          const valor_tratado = valor.replaceAll('.', '').replaceAll('-', '');
          
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
                  input.value = new StringMask(masks.filter(e => e.input_id == 'CPF')[0].mask, {reverse: true}).apply(dados_recuperados[key]);
                  break;
                  
                  case 'n_contrato':
                  input.value = new StringMask(masks.filter(e => e.input_id == 'numero-contrato')[0].mask, {reverse: true}).apply(dados_recuperados[key]);
                  break;
                  
                  case 'conta':
                  case 'conta-vendedor':
                  input.value = new StringMask(masks.filter(e => e.input_id == 'conta')[0].mask, {reverse: true}).apply(dados_recuperados[key]);
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
          
          setTimeout(() => {
            // $(modal_informacoes).modal('show');
          }, 0)
          
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
  
  window.addEventListener("load", function () {
    $('body').append(conteudos.principal)
    
    $('[data-element-paste]').each((index, element) => {
      element.textContent = '';
    })
    
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
    
  });
  
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
  
})();