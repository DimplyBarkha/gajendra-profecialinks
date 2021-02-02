const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'parfumdreams',
    transform: transform,
    domain: 'parfumdreams.de',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {

      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class*="product-image"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      
      const ean  = getXpath("//script[contains(text(),'runAfterUcInit') and contains(text(),'ean')]/text()", 'nodeValue')
      try {
        // @ts-ignore
        let jsonData = ean;
        if (jsonData != null) {
          //let jsonData=ean[0].innerText;
          let splitJsonData = jsonData.split('"impressions":')[1];
          var a = splitJsonData.match(/position/g).length; console.log(a)
          let splitJsonData2 = splitJsonData.split('"position":' + a)[0];
          splitJsonData2 = splitJsonData2 + '"position":' + a + '}]';
          splitJsonData2 = JSON.parse(splitJsonData2);
          for (var i = 0; i < splitJsonData2.length; i++) {
            addHiddenDiv('ean', splitJsonData2[i].ean, i);
            addHiddenDiv('id', splitJsonData2[i].simpleId, i);
          }
        }
      }
      catch (error) { }

    });
    return await context.extract(productDetails, { transform });
  },
};