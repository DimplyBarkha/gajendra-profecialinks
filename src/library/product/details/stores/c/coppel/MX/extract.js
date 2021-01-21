const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'coppel',
    transform: cleanUp,
    domain: 'coppel.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
   // await context.waitForSelector('ul[id="ProductAngleImagesAreaList"] > li > a > img', {}, { timeout: 5000000 });
   // await context.waitForSelector('span[class="sku"]', {}, { timeout: 5000000 });
    //await context.waitForSelector('div[class="flix-feature-image"] > img', {}, { timeout: 5000000 });    
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(5000);
            break;
          }
        }
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
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
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      const skuXpath = getXpath("//span[@class='sku']//text()",'nodeValue');
      console.log("sku: ", skuXpath);
      if(skuXpath != null  ){
        const sku = skuXpath ? skuXpath.split(':') : [];
        addElementToDocument('sku_added',sku[1]);
        }


        const gtinupc = getXpath("//table[@class='table table-bordered']/tbody/tr/td[contains(.,'Modelo #:')]/following-sibling::td",'innerText');
        if(gtinupc != null){
        console.log("upc: ", gtinupc);
        addElementToDocument('gtin_added',gtinupc);
        }

        const gtinXpath = getXpath("//input[@id='gtin']/@value",'nodeValue');
        if(gtinXpath != null){
          console.log("gtin: ", gtinXpath);
          const gtinValue = gtinXpath ? gtinXpath.split(':') : [];
          addElementToDocument('gtin_added',gtinValue[1]);
          } 

        const altImgXpath = getAllXpath("//div[@id='ProductAngleImagesArea']/ul/li[position()>1]/a/img/@src",'nodeValue');
        if(altImgXpath.length > 0){
          console.log("AltImgXpath:", altImgXpath.join('|'));
          addElementToDocument('altImgs_added',altImgXpath.join(' | '));
        }
      
        const aplusImagesXpath = getAllXpath("//div[@class='flix_feat']/img/@data-flixsrcset",'nodeValue');
        const aplusFlixImagesXpath = getAllXpath("//div[@class='flix-carousel flix-carousel-stage']/ul/li/img/@data-flixsrcset",'nodeValue');
        if(aplusImagesXpath.length > 0) {
        console.log("Aplus Images:", aplusImagesXpath);
        addElementToDocument('aplusImages_added',aplusImagesXpath);
        } else if(aplusFlixImagesXpath.length > 0){
          console.log("Aplus Flix Images:", aplusFlixImagesXpath);
          addElementToDocument('aplusImages_added',aplusFlixImagesXpath);  
        }

        const allSpecs = getAllXpath("//div[contains(@class,'flix-tech-spacs-contents')]/ul/li/div/div[2]/font/font/text()",'nodeValue').join('|');
        console.log("Specifications:", allSpecs);
        addElementToDocument('specs_added',allSpecs);

        if(altImgXpath.length > 0) {
          console.log("secondaryImg total:", altImgXpath.length);
          addElementToDocument('secondaryImgcount_added',altImgXpath.length);
        }
        
   });
  await context.extract(productDetails, { transform: transformParam });
  },
};
