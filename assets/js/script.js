"use strict";

import { tooltips } from './modulos/utilitarios.js';

(() => {
  // hljs.highlightAll();
  
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
    })
  }
  
  function atribuirAcoes(){
    const acoes = document.querySelectorAll('[data-action]');
    acoes.forEach(acao => {
      switch(acao.dataset.action.toLowerCase().trim()){
        case 'editar-informacoes':
        break;

        case 'imprimir-capa':
        break;

        default:
          throw new Error('Ação não implementada para o link informado.');
        break;
      }
    })
  }

  window.addEventListener("load", function () {
    const overlay2 = document.querySelector(".overlay-2");
    overlay2.style.display = "none";
    atribuirLinks();
    atribuirAcoes();
    tooltips();
  });
})();