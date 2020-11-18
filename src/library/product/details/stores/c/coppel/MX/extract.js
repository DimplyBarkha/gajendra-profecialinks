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

      const skuXpath = getXpath("//*[@class='sku hidden']//text()",'nodeValue');
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

        const altImgXpath = getAllXpath("//*[contains(@id,'WC_CachedProductOnlyDisplay_links_')]/@href",'nodeValue').join(' | ');
        console.log("AltImgXpath:", altImgXpath);
        addElementToDocument('altImgs_added',altImgXpath);

        const aplusImages = getAllXpath("//*[@id='inpage_container']//img/@data-flixsrcset",'nodeValue').join(' | ');
        console.log("Aplus Images:", aplusImages);
        addElementToDocument('aplusImages_added',aplusImages);

        const allSpecs = getAllXpath("//*[@class='flix-svg-text flix-d-p']/text()",'nodeValue').join('|');
        console.log("Specifications:", allSpecs);
        addElementToDocument('specs_added',allSpecs);

        const secondaryImg = altImgXpath.split('|');
        console.log("secondaryImg total:", secondaryImg.length);
        addElementToDocument('secondaryImgcount_added',secondaryImg.length);
  
   });
  await context.extract(productDetails, { transform: transformParam });
  },
};
