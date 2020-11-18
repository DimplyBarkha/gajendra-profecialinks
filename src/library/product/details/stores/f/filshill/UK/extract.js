const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'filshill',
    transform: null,
    domain: 'filshill.co.uk',
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

      const saturatedUOM = getXpath("/html/body/table/tbody/tr/td[2]/div/table[5]/tbody/tr[2]/td/table/tbody/tr[4]/td[2]",'nodeValue');
      console.log("sku: ", saturatedUOM);
      if(saturatedUOM != null  ){
        const sfatUOM = saturatedUOM ? saturatedUOM.slice(-2) : [];
        addElementToDocument('sfat_uom',sfatUOM);
        console.log(sfatUOM);
        }

        const totfatUOM = getXpath("/html/body/table/tbody/tr/td[2]/div/table[5]/tbody/tr[2]/td/table/tbody/tr[4]/td[2]",'nodeValue');
        console.log("sku: ", totfatUOM);
        if(totfatUOM != null  ){
          const tfat = totfatUOM ? totfatUOM.slice(-2) : [];
          addElementToDocument('tfat_uom',tfat);
          console.log(tfat);
          }
  
   });
  await context.extract(productDetails, { transform: transformParam });
  },
};
