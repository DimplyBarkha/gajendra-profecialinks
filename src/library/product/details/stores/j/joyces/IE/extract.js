const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'joyces',
    transform: cleanUp,
    domain: 'joyces.ie',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
        setTimeout(() => {
        resolve();
        }, ms);
        });
      }

        let scrollTop = 500;
        while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
        break;
        }
        }

      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const getAllXpath = (xpath, prop) => {        
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); 
      const result = [];       
      for (let index = 0; index < nodeSet.snapshotLength; index++) {       
      const element = nodeSet.snapshotItem(index);          
      if (element) result.push(prop ? element[prop] : element.nodeValue);        }     
      return result; 
      };
    
     /* const manufacturerDescription_xpath = "//div[@class='flix-Text-block']";
      const manufacturerDescription = getAllXpath(manufacturerDescription_xpath, 'innerText');
      addElementToDocument('added_manufacturerDescription', manufacturerDescription);*/
        
      var weight_net_str = getXpath("//table[@class='flix-std-specs-table']", 'innerText');
      console.log(weight_net_str);
      if(weight_net_str!=null){
        weight_net_str = weight_net_str.toLowerCase();
        if(weight_net_str.includes('weight') && weight_net_str.includes('kg')){
          const weight_net = weight_net_str.substring(weight_net_str.lastIndexOf("weight")+7, weight_net_str.lastIndexOf("kg")+2);
          addElementToDocument('added_weightNet', weight_net);
          console.log(weight_net);
        }
      }
      let additional_bullet_info;
      const description_info_xpath="//div[@class='woocommerce-product-details__short-description']//p";
      let description_info = getXpath(description_info_xpath, 'innerText');
      const additional_description_info_xpath = "//div[@id='tab-description']";
      let additional_description_info = getAllXpath(additional_description_info_xpath, 'innerText');
      if(additional_description_info.length>0){
        if(description_info!=null){
          additional_bullet_info =description_info + "||" +additional_description_info.join('||');
        }
        else {
          additional_bullet_info =additional_description_info.join('||');
        }
        additional_bullet_info.split("||").forEach((item)=>{
          addElementToDocument('added_description_bullet_info', item);
        });
      }
      else {
        additional_bullet_info=description_info;
        addElementToDocument('added_description_bullet_info', additional_bullet_info);
      }
    //Manufacture Description
    let manufacturerDescription_xpath_option = getAllXpath("//div[contains(@id,'inpage_container')]//div[(contains(@class,'flix-d-p') or contains(@class,'flix-std-desc')) and not(contains(@class,'flix-title')or contains(@class,'flix-caveat-desc'))]", 'innerText');
    if(manufacturerDescription_xpath_option.length>0){
      addElementToDocument('added_manufacturerDescription', manufacturerDescription_xpath_option);
    }
      const videoUrlPath = getXpath("//div[@class='fullJwPlayerWarp']//input[@class='flix-jw']/@value", 'nodeValue');
      if (videoUrlPath && typeof videoUrlPath === 'string') {
        var videoUrlObj = JSON.parse(videoUrlPath);
        addElementToDocument('added_video_url', "http:"+videoUrlObj.playlist[0].file);
      }
      if(getXpath("//div[@id='tab-description']//iframe/@src",'nodeValue')!=null){
        let videoPath=getXpath("//div[@id='tab-description']//iframe/@src",'nodeValue');
        addElementToDocument('added_video_url', videoPath);
      }
      const specificationsXpath = "//table[@class='flix-std-specs-table']/tbody/tr/td";
      var specificationsStr = getAllXpath(specificationsXpath, 'innerText').join(' || ');
      addElementToDocument('added_specifications', specificationsStr);

    });
    await context.extract(productDetails);
  },
};



  

 
