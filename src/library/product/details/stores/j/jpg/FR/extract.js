const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    transform: cleanUp,
    domain: 'jpg.fr',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.waitForSelector('div[class="flex"]', 6000)
    await context.evaluate(async () => {
      try {
        // @ts-ignore
        document.querySelector('button[id=onetrust-accept-btn-handler]').click()
        await new Promise(r => setTimeout(r, 6000));
      } catch (error) {

      }
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
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

      var arr1 = getAllXpath('//div[@class="product-sku__details"]//ul//li/text()', 'nodeValue');
      var arr2 = getAllXpath('//div[@class="description-sku__figure-text"]/ul/li/text()', 'nodeValue');
      var arr3 = getXpath('//div[@class="description-sku__figure-text"]/ul/li/b/text()', 'nodeValue');
      var final = ""
      if (arr1.length>=1){
        for(var k=0 ; k<arr1.length; k++){
          final = final+" || "+ arr1[k]
          }  
      }
      if (arr3!=null){
        final = final+" || "+arr3
      }
      if (arr2.length>=1){
      for(var k=0 ; k<arr2.length; k++){
        final = final+" ||"+ arr2[k]
        }
      }
      if (final.length>=1){
        addElementToDocument('desc', final);
      }
      
    });

    return await context.extract(productDetails, { transform });

  },
};