const isEmpty = (valor) => {
  if(typeof valor == 'string'){
    return valor == undefined || valor == null || valor.length <= 0;
  }else if(Array.isArray(valor)){
    return valor.length <= 0;
  }else if(typeof valor == 'object'){
    return Object.keys(valor).length <= 0;
  }else{
    return valor == undefined || valor == null
  }
}

const capitalize = (valor) => {
  return valor.charAt(0).toUpperCase() + valor.substr(1, valor.length);
}

const atualizarDatas = () => {
  const dataAtual = new Date();
  document.querySelectorAll("[data-ano-atual]").forEach(area => {
    area.textContent = `${dataAtual.getFullYear()}`;
  })
} 

const controleFechamentoModal = () => {
  const modais = document.querySelectorAll('.modal');
  modais.forEach(modal => {
    const btnFecha = modal.querySelector('[data-modal-fecha]');
    btnFecha.addEventListener('click', () => {
      $('#' + modal.id).modal('hide');
    })
  })
}

function sanitizarString(string){
  if(typeof string == 'string'){
    const substituir = [
      {
        original: '-',
        subst: ''
      },
      {
        original: '(',
        subst: ''
      },
      {
        original: ')',
        subst: ''
      },
      {
        original: ' ',
        subst: ''
      },
      {
        original: '.',
        subst: ''
      },
    ]

    substituir.forEach(substituicao => {
      string = string.replaceAll(substituicao.original, substituicao.subst)
    })

    return string.trim();
  }else{
    console.log('O tipo do parâmetro passado não é uma string.');
    return null;
  }
}

const sanitizarNumero = (valor) => {
  return !isEmpty(valor) ? valor.replace(/\D/g, '') : valor;
}

function tooltips(){
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
}

function popovers(){
  $(document).ready(function(){
    $('[data-bs-toggle="popover"]').popover();  
  });
}

async function SwalAlert(tipo, icon, title, text, mensagem, text_confirm, focus_cancel, time){
  tipo = tipo.toLowerCase().trim();
  if(tipo == 'confirmacao'){
    const dialog = await Swal.fire({
      icon: icon,
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: text_confirm,
      focusCancel: focus_cancel
    })

    return new Promise((resolve, reject) => {
      resolve({isConfirmed: dialog.isConfirmed})
    })
  }

  else if(tipo == 'aviso'){
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      timer: time
    })
  }

  else if(tipo == 'error'){
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      footer: mensagem,
      timer: time
    }) 
  }
}

function resizeTextArea(textarea){
  // Créditos https://www.instagram.com/reel/CrdgXF3AECg/
  const initialHeight = parseInt(getComputedStyle(textarea).getPropertyValue('height'));
  textarea.addEventListener('input', () => {
    textarea.style.height = `${initialHeight}px`;
    const scrollHeight = textarea.scrollHeight;
    const newHeight = textarea.scrollHeight - initialHeight;
    textarea.style.height = `${newHeight < scrollHeight ? scrollHeight : newHeight}px`;
  });
}

function zeroEsquerda(quantidadeZeros, valor){
  let zeros;
  
  for(let i = 0; i < quantidadeZeros; i++){
    zeros == null ? zeros = "0" : zeros = zeros + "0";
  }
  return (zeros + valor).slice(-quantidadeZeros);
}

function verificarCPF(cpf){
  cpf = cpf.replace(/\D/g, '');

  switch (cpf){
    case '00000000000':
    resultado = false
    break;
    case '11111111111':
    resultado = false
    break;
    case '22222222222':
    resultado = false
    break;
    case '33333333333':
    resultado = false
    break;
    case '44444444444':
    resultado = false
    break;
    case '55555555555':
    resultado = false
    break;
    case '66666666666':
    resultado = false
    break;
    case '77777777777':
    resultado = false
    break;
    case '88888888888':
    resultado = false
    break;
    case '99999999999':
    resultado = false
    break;
    default: 
    if(cpf.toString().length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    var resultado = true;
    [9,10].forEach(function(j){
      var soma = 0, r;
      cpf.split(/(?=)/).splice(0,j).forEach(function(e, i){
        soma += parseInt(e) * ((j+2)-(i+1));
      });
      r = soma % 11;
      r = (r <2)?0:11-r;
      if(r != cpf.substring(j, j+1)) resultado = false;
    });
  }
  
  return resultado;
}

const copiar = async (valor) => {
  await navigator.clipboard.writeText(valor);
}

function primeiroNome(nome){
  const nome_separado = nome.split(' ');
  return nome_separado[0];
}

const criarEBaixarArquivo = (conteudo, nome_arquivo, ext) => {
  try{
    let blob = new Blob([`${JSON.parse(conteudo)}`], {type: "text/plain;charset=utf-8"});
    saveAs(blob, `${nome_arquivo.toUpperCase()}.${ext}`);
  }catch(error){
    console.warn('Framework File Saver necessário');
    throw new Error(error);
  }
}

export{
  isEmpty,
  capitalize,
  atualizarDatas,
  controleFechamentoModal,
  sanitizarString,
  tooltips,
  popovers,
  SwalAlert,
  resizeTextArea,
  zeroEsquerda,
  verificarCPF,
  copiar,
  primeiroNome,
  sanitizarNumero,
  criarEBaixarArquivo
}