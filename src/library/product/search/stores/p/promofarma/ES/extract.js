const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'promofarma',
    transform: cleanUp,
    domain: 'promofarma.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // Method to Retrieve Xpath content of a Multiple Nodes
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      const sliceURL = (data) => {
        var cnt = 0;
        for (let index = 0; index < data.length; index++) {
          if (data[0] != 0) {
            cnt++;
            addElementToDocument('altImages', cnt);
          }
        }
      };
      var backgroundURL = getAllXpath('//div[@class="col-sm-6 col-md-4 col-lg-3 item-container"]/article/@data-id', 'nodeValue');
      sliceURL(backgroundURL);
    });
    return await context.extract(productDetails, { transform });
  },
};
