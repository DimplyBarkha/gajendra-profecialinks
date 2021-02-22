const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaschenpost',
    transform: cleanUp,
    domain: 'flaschenpost.de',
    zipcode: '28203',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.waitForFunction(function (xp) {
      return Boolean(document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 50000 }, '//script[contains(text(),"variant")]/text()');
    
    await context.evaluate(async () => {

      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="fp_product_details"] div[class*="fp_article"] div[class="fp_article_details"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      var vari = getXpath('//script[contains(text(),"variant")]/text()', 'nodeValue');
      console.log('karthi', vari)
      if (vari != null) {
        if (vari.includes("id:'")) {
          var ids = vari.split("id:'");
          let finalIds = [];
          for (let j = 1; j < ids.length; j++) {
            if (ids[j].includes("',")) {
              console.log('abc', ids[j])
              finalIds.push(ids[j]);
            }
          }
          for (var i = 0; i < finalIds.length; i++) {
            var temp = finalIds[i].split("',")[0];
            addHiddenDiv('rpc', temp, i);
          }
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
}