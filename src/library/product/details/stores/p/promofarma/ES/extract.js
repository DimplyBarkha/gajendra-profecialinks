const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'promofarma',
    transform: null,
    domain: 'promofarma.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      try {
        // @ts-ignore
        document.querySelector('button[id="onetrust-accept-btn-handler"]').click()
        await new Promise(r => setTimeout(r, 10000));
      } catch (error) {

      }
      try {
        // @ts-ignore
        document.querySelector('div[class="text-center"]>button').click()
        await new Promise(r => setTimeout(r, 10000));
      } catch (error) {
      }
      try {
        // @ts-ignore
        document.querySelector('div[class="abtasty-modal__close abtasty-modal__close--inside"]').click()
        await new Promise(r => setTimeout(r, 10000));
      } catch (error) {
      }
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      // Method to Retrieve Xpath content of a Single Node
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      var URL2 = getXpath('(//a[@class="MagicZoom"]/text())', 'nodeValue');
      if (URL2 != null) {
        URL2 = "Yes"
      } else {
        URL2 = "No"

        addElementToDocument('zoom', URL2);
      }
      try {
        // @ts-ignore
        var man1 = document.querySelector('p[data-qa-ta="couponInfo"]').innerText
        // @ts-ignore
        var man2 = document.querySelector('div[id="content-description"]').innerText        
        var man = man1 + ' || ' + man2

        addElementToDocument('manu', man);

      } catch (error) {

      }
      try {
        var video = getXpath("(//div[@id='description']/div[@id='wrapper-description']/div//@data-content)", 'nodeValue');
        var video = video.split('src="')[1]
        var video = video.split(" ")[0]
        var video = video.slice(0, -1)
        addElementToDocument('video', video);
      } catch (error) {
        
      }
      var URL2 = getXpath("//div[@class='box-white']//h3[contains(text(),'Modo de empleo')]//following-sibling::p//text()", 'nodeValue');
      var URL3 = getAllXpath("//div[@class='box-white']//h3[contains(text(),'Modo de empleo')]//following-sibling::ul//text()", 'nodeValue');
      var URL4 = getAllXpath("//div[@class='box-white']//h4[contains(text(),'Consejo Farmacéutico')]//following-sibling::div/div[1]//text()", 'nodeValue');
      var URL5 = []
      var URL7 = []
      var URL6 = ""
      var URL8 = ""
      if(URL4.length>=1){    
      for (var i = 0 ; i<URL4.length; i++){
        URL4[i]=URL4[i].trim();
        if(URL4[i].length >=1){
          URL5.push(URL4[i]);          
          }
        }  
          URL6 = "||"+ URL5.join(","); 
          if (URL6.includes(":,")){
            // @ts-ignore
            URL6 = URL6.replaceAll(":,",":");
        }
        if (URL6.includes(".,")){
          // @ts-ignore
          URL6 = URL6.replaceAll(".,",".");
      }
    }
    if(URL3.length>=1){    
      for (var i = 0 ; i<URL3.length; i++){
        URL3[i]=URL3[i].trim();
        if(URL3[i].length >=1){
          URL7.push(URL3[i]);          
          }
        } 
        URL8 = URL7.join(",");   
        if (URL8.includes(":,")){
          // @ts-ignore
          URL8 = URL8.replaceAll(":,",":");
      }
      if (URL8.includes(".,")){
        // @ts-ignore
        URL8 = URL8.replaceAll(".,",".");
    }      
    }
          var old = ""
        if (URL2 != null) old = old + URL2.trim();
        if (URL8 != null) old = old + URL8;
        if (URL6 != null) old = old + URL6;
        addElementToDocument('direction', old);
                 
    
    
    });
    await context.extract(productDetails);
  },
};

