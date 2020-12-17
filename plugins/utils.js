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
const getStartEndTime = (video) => {

    switch(video.liveBroadcastContent) {
        case 'suspended':
        case 'upcoming':
            if(video.scheduledStartTime) {
                let endD = new Date(video.scheduledStartTime);
                endD.setHours(endD.getHours() + 2);
                return [new Date(video.scheduledStartTime), endD]
            }
        case 'live':
            if(video.actualStartTime) {
                let startD = new Date(video.actualStartTime);
                let now = new Date();
                let diff = now.getTime() - startD.getTime();
                if(diff < 2 * 60 * 60 * 1000) {
                    let endD = new Date(startD.getTime());
                    endD.setHours(endD.getHours() + 2);
                    diff = endD.getTime() - now.getTime();
                    if(diff < 0.5 * 60 * 60 * 1000) {
                        now.setMinutes(now.getMinutes() + 30);
                        endD = now;
                    }
                    return [startD, endD];
                } else {
                    now.setMinutes(now.getMinutes() + 30);
                    return [startD, now];
                }
            }
        default:
            if(video.actualStartTime && video.actualEndTime) {
                return [new Date(video.actualStartTime), new Date(video.actualEndTime)]
            }
            break;
    }
}

/*const initializeVideos = (srcVideos, colorIdx) => {

    let videos = [];
    if( srcVideos ) {
        let idx = 0;
        for(let video of srcVideos) {
            video.idx = idx;idx++;
            let [date1, date2] = getStartEndTime(video);
            video.startTime = date1.getTime();
            video.endTime = date2.getTime();
            let date1_border = new Date(date1.getTime());
            let date2_border = new Date(date2.getTime());
            date1_border.setHours(date1_border.getHours() - 12);
            date2_border.setHours(date2_border.getHours() + 12);
            let nglist = [];

            for(let i = 0; i < videos.length ; i++) {
                let [start, end] = getStartEndTime(videos[i]);

                if(date1_border < start && start <= date1 && date1 < end) {
                    nglist.push(videos[i].topIndex);
                } else if(date2_border > end && start <= date2 && date2 < end) {
                    nglist.push(videos[i].topIndex);
                } else if(start >= date1 && date2 >= end) {
                    nglist.push(videos[i].topIndex);
                }
            }
            video.topIndex = 0;
            while(nglist.indexOf(video.topIndex) !== -1) {
                video.topIndex++;
            }
            video.topOffset = video.topIndex * 54;
            if(video.liveBroadcastContent !== 'live') {
                video.topOffset++;
            }

            for(let ccmap of colorIdx) {
                if(video.channelId === ccmap.id) {
                    video.color = ccmap.color;
                    break;
                }
            }

            videos.push(video);
        }
    }
    return videos;
}*/
const initializeVideos = (srcVideos, colorIdx) => {

    if( srcVideos ) {
        let idx = 0;
        for(const [index, video] of srcVideos.entries()) {
            video.idx = idx;idx++;
            let [date1, date2] = getStartEndTime(video);
            video.startTime = date1.getTime();
            video.endTime = date2.getTime();
            let date1_border = new Date(date1.getTime());
            let date2_border = new Date(date2.getTime());
            date1_border.setHours(date1_border.getHours() - 12);
            date2_border.setHours(date2_border.getHours() + 12);
            let nglist = [];

            for(let i = 0; i < index ; i++) {
                let [start, end] = getStartEndTime(srcVideos[i]);

                if(date1_border < start && start <= date1 && date1 < end) {
                    nglist.push(srcVideos[i].topIndex);
                } else if(date2_border > end && start <= date2 && date2 < end) {
                    nglist.push(srcVideos[i].topIndex);
                } else if(start >= date1 && date2 >= end) {
                    nglist.push(srcVideos[i].topIndex);
                }
            }
            video.topIndex = 0;
            while(nglist.indexOf(video.topIndex) !== -1) {
                video.topIndex++;
            }
            video.topOffset = video.topIndex * 46;
            if(video.liveBroadcastContent !== 'live') {
                video.topOffset++;
            }

            for(let ccmap of colorIdx) {
                if(video.channelId === ccmap.id) {
                    video.color = ccmap.color;
                    break;
                }
            }
        }
    }
    return srcVideos;
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
  inject('initializeVideos', initializeVideos);
//  inject('initializeVideos2', initializeVideos2);

/*
  inject('formatDate', formatDate);

  inject('genElement', genElement);
  inject('generateElement', generateElement);*/
}