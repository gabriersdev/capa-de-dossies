import { isEmpty } from "../modulos/utilitarios.js"

class Settings{
  options = {
    "autocomplete": {
      "type": "boolean",
      "default": true,
      "propertie": "checked"
    },
    "exibir-opt-link": {
      "type": "boolean",
      "default": false,
      "propertie": "checked"
    },
    "logo-cca": {
      "type": "string",
      "default": "",
      "propertie": "value,src"
    },
    "codigo-cca": {
      "type": "string",
      "default": "000000000",
      "propertie": "value"
    },
    "armazena-dados": { // TODO - Implementar a funcionalidade de confirmar armazenar os dados
      "type": "boolean",
      "default": true,
      "propertie": "checked"
    },
    "exibir-prod-com": {
      "type": "boolean",
      "default": true,
      "propertie": "checked"
    }
  }
  
  constructor(){
    this.options = {
      "autocomplete": {
        "type": "boolean",
        "default": true,
        "propertie": "checked"
      },
      "exibir-opt-link": {
        "type": "boolean",
        "default": false,
        "propertie": "checked"
      },
      "logo-cca": {
        "type": "string",
        "default": "",
        "propertie": "value,src"
      },
      "codigo-cca": {
        "type": "string",
        "default": "000000000",
        "propertie": "value"
      },
      "armazena-dados": { // TODO - Implementar a funcionalidade de confirmar armazenar os dados
        "type": "boolean",
        "default": true,
        "propertie": "checked"
      },
      "exibir-prod-com": {
        "type": "boolean",
        "default": true,
        "propertie": "checked"
      }
    }
  }
  
  CRUDoption(action, config_name, config_value){
    try{
      const settings_saved = JSON.parse(localStorage.getItem("capa-dossie-html-configs")) || "";
      
      if(isEmpty(settings_saved)){
        this.createSettingsObject(settings_saved);
      }
      
      switch(action.toLowerCase()){
        case "update":
        try{
          settings_saved[config_name] = config_value;
          localStorage.setItem("capa-dossie-html-configs", JSON.stringify(settings_saved));
        }catch(error){
          console.log("Um erro ocorreu ao alterar a configuração. Erro: %s", error);
        }
        break;
        
        case "read":
        default:
        return settings_saved[config_name] == "#" ? "" : settings_saved[config_name] ?? "";
        break;
      }
      
    }catch(error){
      try{
        this.createSettingsObject(JSON.parse(localStorage.getItem("capa-dossie-html-configs")) || "");
      } catch (error){
        this.createSettingsObject("");
      }
    }
  }
  
  // Criando o objeto no localStorage
  createSettingsObject(settings_saved){
    if(isEmpty(settings_saved)){
      try{
        let value = new Object();
        for(let option of Object.keys(this.options)){
          // Com os valores padrões
          value[option] = this.options[option]["default"];
        }
        localStorage.setItem("capa-dossie-html-configs", JSON.stringify(value));
      }catch(error){
        console.log("Ocorreu um erro ao criar o objeto em localStorage. Erro: %s", error);
      }
    }
  }
  
  optionIsValid(config_name){
    return (Object.keys(this.options).includes(config_name));
  }
  
  setOption(config_name, config_value){
    if(this.optionIsValid(config_name)){
      if(!isEmpty(config_value)){
        if(this.options[config_name]["type"] === "boolean" && [true, false].includes(config_value)){
          this.CRUDoption("update", config_name, config_value);
        }else if(this.options[config_name]["type"] === typeof config_value){
          this.CRUDoption("update", config_name, config_value);
        }else{
          throw new Error("O valor informado para alterar a configuração não é válido.");
        }
      }else{
        this.CRUDoption("update", config_name, this.options[config_name]["default"]);
      }
      
      return this.CRUDoption("read", config_name);
    }
  }
  
  getOption(config_name){
    if(this.optionIsValid(config_name)){
      return this.CRUDoption("read", config_name)
    }
    
    return null;
  }
  
  getOptions(){
    return Object.keys(this.options);
  }
  
  getOptionsValues(){
    try{
      const ret = new Object();
      for(let item of Object.entries(this.options)){
        const values = this.CRUDoption("read", item[0]);
        
        if(isEmpty(values)){
          this.setOption(item[0]);
        }
        
        ret[item[0]] = {values: this.CRUDoption("read", item[0]), propertie: item[1]["propertie"]};
      }
      
      return ret;
    }catch(error){
      console.log("Um erro ocorreu ao obter as configurações. Erro: %s", error);
    }
  }
  
  getVarSettingArmazenaDados(){
    return [true, false].includes(this.getOption("armazena-dados")) ? this.getOption("armazena-dados") : this.options["armazena-dados"]["default"];
  }
}

export{
  Settings
}