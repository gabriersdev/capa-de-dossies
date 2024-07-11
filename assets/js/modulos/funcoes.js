import { SwalAlert } from "./utilitarios.js";

/**
* Retrieves the text of a specif page within a PDF Document obtained through pdf.js 
* 
* @param {Integer} pageNum Specifies the number of the page 
* @param {PDFDocument} PDFDocumentInstance The PDF document obtained 
* @return {String} The text of the page
**/
function getPageText(pageNum, PDFDocumentInstance) {
  // Return a Promise that is solved once the text of the page is retrieven
  return new Promise(function (resolve, reject) {
    PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
      // The main trick to obtain the text of the PDF page, use the getTextContent method
      pdfPage.getTextContent().then(function (textContent) {
        var textItems = textContent.items;
        var finalString = "";
        
        // Concatenate the string of the item to the final string
        for (var i = 0; i < textItems.length; i++) {
          var item = textItems[i];
          
          finalString += item.str + " ";
        }
        
        // Solve promise with the text retrieven from the page
        resolve(finalString);
      });
    });
  });
}

/**
* Get data from file
* 
* @param {String} fileData The file data
* @returns {Promise} The data from the file
**/
const getData = (fileData) => {
  // Loaded via <script> tag, create shortcut to access PDF.js exports.
  const { pdfjsLib } = globalThis;
  
  // The workerSrc property shall be specified.
  pdfjsLib.GlobalWorkerOptions.workerSrc = './assets/js/frameworks/pdf.worker.mjs';
  
  // Asynchronous download of PDF
  const loadingTask = pdfjsLib.getDocument({data: fileData});
  return loadingTask.promise.then(function(pdf) {
    // console.log('PDF loaded');
    
    const pdfDocument = pdf;
    // Create an array that will contain our promises 
    let pagesPromises = [];
    
    for (let i = 0; i < pdf.numPages; i++) {
      // Required to prevent that i is always the total of pages
      (function (pageNumber) {
        // Store the promise of getPageText that returns the text of a page
        pagesPromises.push(getPageText(pageNumber, pdfDocument));
      })(i + 1);
    }
    
    // Execute all the promises
    return Promise.all(pagesPromises).then(function (pagesText) {
      // Display text of all the pages in the console
      // e.g ["Text content page 1", "Text content page 2", "Text content page 3" ... ]
      
      if (pagesText.some((p) => p.trim() === '')) {
        // When don't possible to read the PDF - PDF is empty
        return [];
      } else {
        // When possible to read the PDF
        /** 
        * Get the content between two strings
        * 
        * @param {String} text The text to be searched
        * @param {String} start The start string
        * @param {String} end The end string
        * @returns {Array} The content between the two strings or an empty array
        **/
        const getContent = (text, start, end) => {
          try { 
            if (!index && index !== 0) return text.search(start) > 0 && text.search(end) > 0 ? text.match(new RegExp(`(${start}).*(${end})`, 'gi')).map((p) => p.replace(new RegExp(`(${start})|(${end})`, 'gi'), '').trim()) : null
            else return text.search(start) > 0 && text.search(end) > 0 ? text.match(new RegExp(`(${start}).*(${end})`, 'gi')).map((p) => p.replace(new RegExp(`(${start})|(${end})`, 'gi'), '').trim())[index] : null;
          } catch (e) { return null; }
        }
        
        /** 
        * Get the context using regex
        * 
        * @param {String} text The text to be searched
        * @param {String} regex The regex to be used
        * @param {String} regexSanit The regex to be sanitized
        * @param {Integer} index The index of the array
        * @returns {Array} The content between the two strings or an empty array
        **/
        const getContextUsingRegex = (text, regex, regexSanit, index) => {
          try{
            if (!new RegExp(regex).test(text)) return null;
            if (!index && index !== 0) return text.match(new RegExp(regex)).map((p) => p.replace(new RegExp(regexSanit), '').trim());
            else return text.match(new RegExp(regex)).map((p) => p.replace(new RegExp(regexSanit), '').trim())[index];
          } catch (e) {
            return null;
          }
        }
        
        /** 
        * Get the account number
        * 
        * @param {String} ret The text to be searched
        * @param {Integer} index The index of the array
        * @returns {Array} The content between the two strings or an empty array
        **/
        const getAccount = (ret,  index) => {
          try{
            if (ret) {
              const account = Array.isArray(ret) ? ret[0].split('-') : ret.split('-');
              return account[index];
            } else {
              return null;
            }
          }catch (e) {
            return '';
          }
        }
        
        // console.log('Here!');
        const text = pagesText.join(' ').replace(/\s+,/g, ',').replace(/\s+/g, ' ').trim();

        // Imprime o texto do PDF no console para auditoria
        console.groupCollapsed('Texto do PDF - Auditoria' + ' - ' + new Date().toLocaleString());
        console.log(text);
        console.groupEnd();

        const scapeValue = null;

        const regex = {
          cpf: /\d{3}\.\d{3}\.\d{3}-\d{2}/gi,
          // Valores
          // [números, vírgulas e ponto]
          valores: /(R\$\s)?[\d\.,]+/gi,
          // Dados das contas
          // [números e traços]
          conta: /\d{4}-\d{3,4}-\d{12}-\d{1}/gi,
          conta_deposito: /\d{3}-\d{4}-\d{3,4}-\d{12}-\d{1}/gi,
          // Outros dados
          // [números, espaços e letras]
          geral: /[\d\D]+/gi,
          // Endereco - Inicia regex com tudo de informação e para quando localizar uma / seguida de 2 letras maiúsculas
          // Encerrando exatamente onde deve estar a sigla do estado no endereço retornado pelo sistema
          endereco: /[\D\d]*\/[A-Z]{2}/g,
          // Captura endereço de URL que comece com HTTP ou HTTPs
          capturaURL: /(https|http):[\w-\.\/?!&=]*/gi
        }

        const sanitizarRetornoRegex = (str, regex, action, replaceValue) => {
          try{
            if (action === 'replace') return str.replace(regex, replaceValue);
            return str.match(regex)[0];
          }catch (e) {
            return null;
          }
        }

        try{
          const data = {
            proponentes: {
              nome: getContextUsingRegex(text, /(Nome:)\s[\w\s]*\s(Sexo)/gi, /Nome:|Sexo/gi, ''),
              CPF: getContextUsingRegex(text, /(CPF:)\s\d{3}\.\d{3}\.\d{3}-\d{2}\s(Nome)/gi, /(CPF:)|Nome/gi),
          },
            modalidade: getContextUsingRegex(text, /((Negociada|Negociação) Item de Produto: \d{1,} -)(\s\w+\s)/gi, /((Negociada|Negociação) Item de Produto: \d{1,} -)|\s/gi, 0),
            contrato: getContextUsingRegex(text, /(Número Contrato para Administração:)\s\d{1}\.\d{4}\.\d{7}-\d{1}\s*Situação/gi, /(Número Contrato para Administração:)|Situação/gi, 0),
            endereco: sanitizarRetornoRegex(getContextUsingRegex(text, /(Endereço da Unidade Habitacional:).*(Vagas de Garagem)/gi, /(Endereço da Unidade Habitacional:)|Vagas de Garagem/gi, 0), regex.endereco),
            empreendimento: sanitizarRetornoRegex(getContextUsingRegex(text, /(Nome do Empreendimento:).*(Tipo de Unidade)/gi, /(Nome do Empreendimento:)|Tipo de Unidade/gi, 0), regex.capturaURL, 'replace', ''),
            valores: {
              valor_compra_e_venda: sanitizarRetornoRegex(getContextUsingRegex(text, /(Valor Compra e Venda ou Orçamento Proposto pelo Cliente:).*(Valor Financiamento Negociado)/gi, /(Valor Compra e Venda ou Orçamento Proposto pelo Cliente:)|Valor Financiamento Negociado/gi, 0), regex.valores) || scapeValue,
              valor_financiamento: sanitizarRetornoRegex(getContextUsingRegex(text, /(Valor Financiamento Negociado:).*(Cota de Financiamento Calculada)/gi, /(Valor Financiamento Negociado:)|Cota de Financiamento Calculada/gi, 0), regex.valores) || scapeValue,
              recursos_proprios: sanitizarRetornoRegex(getContextUsingRegex(text, /(Valor Recursos Próprios Aportados:).*(Valor Recursos Próprios)/gi, /(Valor Recursos Próprios Aportados:)|Valor Recursos Próprios/gi, 0), regex.valores) || scapeValue,
              FGTS: sanitizarRetornoRegex(getContextUsingRegex(text, /(Valor Total Utilizado FGTS:).*(Valor FMP)/gi, /(Valor Total Utilizado FGTS:)|Valor FMP/gi, 0), regex.valores) || scapeValue,
              subsidio: sanitizarRetornoRegex(getContextUsingRegex(text, /(Subsídio Complemento Capacidade Financeira:).*(Valor Operação)/gi, /(Subsídio Complemento Capacidade Financeira:)|Valor Operação/gi, 0), regex.valores) || scapeValue,
              taxa_de_cartorio: sanitizarRetornoRegex(getContextUsingRegex(text, /(Valor das Taxas Financiadas:).*(Taxas à vista)/gi, /(Valor das Taxas Financiadas:)|Taxas à vista/gi, 0), regex.valores) || scapeValue,
            },
            // Conta para débito das parcelas
            conta_debito: {
              // Código da Caixa Econômica Federal 
              banco: '104', 
              agencia: getAccount(getContextUsingRegex(text, /(Conta para Débito:)\s(\d{4}-\d{3,4}-\d{12}-\d{1})\s(Débito em Conta)/gi, /(Conta para Débito:)|(Débito em Conta)/gi), 0),
              operacao: getAccount(getContextUsingRegex(text, /(Conta para Débito:)\s(\d{4}-\d{3,4}-\d{12}-\d{1})\s(Débito em Conta)/gi, /(Conta para Débito:)|(Débito em Conta)/gi), 1),
              conta: getAccount(getContextUsingRegex(text, /(Conta para Débito:)\s(\d{4}-\d{3,4}-\d{12}-\d{1})\s(Débito em Conta)/gi, /(Conta para Débito:)|(Débito em Conta)/gi), 2),
              digito: getAccount(getContextUsingRegex(text, /(Conta para Débito:)\s(\d{4}-\d{3,4}-\d{12}-\d{1})\s(Débito em Conta)/gi, /(Conta para Débito:)|(Débito em Conta)/gi), 3),
            },
            // Dados de conta para déposito - válido para processos individuais
            conta_deposito: {
              banco: getAccount(getContextUsingRegex(text, /(Conta para Crédito:)\s(\d{3}-\d{4}-\d{3,4}-\d{12}-\d{1})\s(Conta para Débito)/gi, /(Conta para Crédito:)|(Conta para Débito)/gi), 0),
              agencia: getAccount(getContextUsingRegex(text, /(Conta para Crédito:)\s(\d{3}-\d{4}-\d{3,4}-\d{12}-\d{1})\s(Conta para Débito)/gi, /(Conta para Crédito:)|(Conta para Débito)/gi), 1),
              operacao: getAccount(getContextUsingRegex(text, /(Conta para Crédito:)\s(\d{3}-\d{4}-\d{3,4}-\d{12}-\d{1})\s(Conta para Débito)/gi, /(Conta para Crédito:)|(Conta para Débito)/gi), 2),
              conta: getAccount(getContextUsingRegex(text, /(Conta para Crédito:)\s(\d{3}-\d{4}-\d{3,4}-\d{12}-\d{1})\s(Conta para Débito)/gi, /(Conta para Crédito:)|(Conta para Débito)/gi), 3),
              digito: getAccount(getContextUsingRegex(text, /(Conta para Crédito:)\s(\d{3}-\d{4}-\d{3,4}-\d{12}-\d{1})\s(Conta para Débito)/gi, /(Conta para Crédito:)|(Conta para Débito)/gi), 4),
            },
          };

          // Imprime dados sanitizados no console
          console.groupCollapsed('Dados obtidos e sanitizados - Auditoria' + ' - ' + new Date().toLocaleString());
          const saidaConsole = {};
          for (const [key, value] of Object.entries(data)) {
            saidaConsole[key] = value;
          }
          console.log(saidaConsole)
          console.groupEnd();

          return data;
        } catch (e) {
          SwalAlert('aviso', 'error', 'Ocorreu um erro ao ler o arquivo. Tente novamente', `Verifique o console.`);
          console.info(e.message);
          return [];
        } 
      }
    });
  }, function (reason) {
    // PDF loading error
    SwalAlert('aviso', 'error', 'Não foi possível carregar o arquivo. Tente novamente', `Verifique o console.`);
    console.info(reason);
    return [];
  });
}

export { getData };