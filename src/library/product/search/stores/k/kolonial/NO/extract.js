const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NO',
    store: 'kolonial',
    transform: transform,
    domain: 'kolonial.no',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    // await context.waitForFunction(function () {
    //   return Boolean(document.querySelector('//div[@class="product-list-item "]//img/@src', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    // }, { timeout: 90000 });
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
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
      function ranking(rank) {
        const abc = document.querySelectorAll('div[class="col-xs-6 col-sm-3 col-md-2"]');
        for (let i = 1; i <= abc.length; i++) {
          addElementToDocument('rank1', i);
        }
      }
      const rank = getXpath('//h3[@class="name"]//div[@class="name-main wrap-two-lines"]', 'nodeValue');
      //const productWeight = productWeightNode ? (productWeightNode.includes('Weight') ? productWeightNode.replace('Weight ', '') : productWeightNode) : '';
      //addElementToDocument('addedProductWeight', productWeight);
      // const abc = document.querySelectorAll('div[class="col-xs-6 col-sm-3 col-md-2"]');
      // for (let i = 1; i <= abc.length; i++) {
      //   addElementToDocument('rank1', i);
      // }
      ranking(rank);
      const URL = window.location.href;
      try {
        document.getElementById('pd_url').remove();
      } catch (error) {
      }
      addElementToDocument('pd_url', URL);
    });
    return await context.extract(productDetails, { transform });
  },
};
