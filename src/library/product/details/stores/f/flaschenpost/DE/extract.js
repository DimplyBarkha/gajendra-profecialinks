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
    await context.evaluate(async () => {
      try {
        const usernameElements = document.querySelectorAll('#validZipcode');
        // @ts-ignore
        usernameElements.forEach(username => username.value = "28203");
        // @ts-ignore
        document.querySelector('div[class="fp-modal_input"]>button').click()
        await new Promise(r => setTimeout(r, 6000));

      } catch (error) {

      }
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
      var vari = getXpath('/html/body/div[1]/script[2]/text()', 'nodeValue');
      if (vari != null) {
        if (vari.includes("id:'")) {
          var ids = vari.split("id:'");
          let finalIds = [];
          for (let j = 1; j < ids.length; j++) {
            if (ids[j].includes("',")) {
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