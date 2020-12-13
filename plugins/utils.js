const formatDate = (date, format) => {
    format = format.replace(/yyyy/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
    return format;
}

/*const genElement = ( tag, classList = [], attr = {}, property = {} ) => {
    let elm = document.createElement( tag );
    for(let clsName of classList ){
        elm.classList.add(clsName);
    }
    if(attr != null && typeof attr == 'object'){
        for(let attrName of Object.keys(attr)) {
            elm.setAttribute(attrName, attr[attrName]);
        }
    }
    if(property != null && typeof property == 'object'){
        for(let propertyName of Object.keys(property)) {
            switch(propertyName) {
                case 'textContent':
                    elm.textContent = property[propertyName];
                    break;
                case 'innerHTML':
                    elm.innerHTML = property[propertyName];
                    break;
                default:
                    break;
            }
        }
    }
    return elm;
}
const generateElement = ( paramObj ) => {
    let element = genElement( paramObj.tag, paramObj.classList, paramObj.attr, paramObj.properties );
    if(paramObj.children != undefined 
        && paramObj.children != null
        && Array.isArray(paramObj.children) ){
            for(let childParam of paramObj.children ){
                if(childParam.element != undefined){
                    element.appendChild(childParam.element);
                }else{
                    element.appendChild(generateElement(childParam));
                }
            }
    }
    return element;
}*/

class API {
  constructor (axios) {
    this.axios = axios;
  }
  get API_ROOT() {
      return "https://api2-dot-holoshift.an.r.appspot.com/api/";
  }

  async request (apiInterface, params = {}) {

    return await this.axios.get(
        this.API_ROOT + apiInterface, {
            params: params
        })
        .catch((e) => {
            console.log("catch request error");
            console.log(e);
            return false;
        });
  }
}
export default function ({ $axios }, inject) {
  const api = new API($axios);
  inject('api', api);
  inject('formatDate', formatDate);

/*
  inject('formatDate', formatDate);

  inject('genElement', genElement);
  inject('generateElement', generateElement);*/
}