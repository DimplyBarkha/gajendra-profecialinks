const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'coppel',
    transform: null,
    domain: 'coppel.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
   // await context.waitForSelector('ul[id="ProductAngleImagesAreaList"] > li > a > img', {}, { timeout: 5000000 });
   // await context.waitForSelector('span[class="sku"]', {}, { timeout: 5000000 });
    //await context.waitForSelector('div[class="flix-feature-image"] > img', {}, { timeout: 5000000 });    
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 5000) {
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
        console.log(sku[1]);
        }

        const gtinXpath = getXpath("//input[@id='gtin']/@value",'nodeValue');
        console.log("gtin: ", gtinXpath);
        if(gtinXpath != null  ){
          const gtinValue = gtinXpath ? gtinXpath.split(':') : [];
          addElementToDocument('gtin_added',gtinValue[1]);
          console.log(gtinValue[1]);
          }

        const altImgXpath = getAllXpath("//div[@id='ProductAngleImagesArea']/ul/li[position()>1]/a/img/@src",'nodeValue');
        if(altImgXpath.length > 0){
          console.log("AltImgXpath:", altImgXpath.join('|'));
          addElementToDocument('altImgs_added',altImgXpath.join('|'));
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

        const allSpecs = getAllXpath("//span[@class='flix-svg-text flix-d-p']/text()",'nodeValue').join('|');
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
