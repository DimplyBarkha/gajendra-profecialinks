const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'meijer',
    transform: cleanUp,
    domain: 'meijer.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
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
            addElementToDocument('rank1',cnt);
            }
        }
      };
      const result = getAllXpath("//div[@class='tile-column details']//a[@class='h7']/text()", 'nodeValue');
      sliceURL(result);
    });
    return await context.extract(productDetails, { transform });
  },
};