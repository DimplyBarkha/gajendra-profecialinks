const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'meijer_US',
    transform: transform,
    domain: 'meijer.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      // let scrollTop = 0;
      // while (scrollTop !== 50000) {
      //   await stall(1000);
      //   scrollTop += 2000;
      //   window.scroll(0, scrollTop);
      //   if (scrollTop === 50000) {
      //     await stall(1000);
      //     break;
      //   }
      // }
      // function stall(ms) {
      //   return new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //       resolve();
      //     }, ms);
      //   });
      // }
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    // Method to Retrieve Xpath content of a Single Node
    var getXpath = (xpath, prop) => {
      var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      let result;
      if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      else result = elem ? elem.singleNodeValue : '';
      return result && result.trim ? result.trim() : result;
    };
    const URL = window.location.href;
    try {
      document.getElementById('pd_url').remove();
    } catch (error) {
    }
    addElementToDocument('pd_url', URL);
  });
  return await context.extract(productDetails, { transform });
}}
