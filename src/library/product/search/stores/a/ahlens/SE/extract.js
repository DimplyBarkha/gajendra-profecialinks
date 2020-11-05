const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'ahlens',
    transform: cleanUp,
    domain: 'ahlens.se',
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
        for (let index = 0; index < data.length; index++) {
          if (data[index].includes(",")) {
            var temp = data[index].replace(",", ".");
          } else {
            temp = data[index];
          }
          addElementToDocument('altImages', temp);
        }
      };
      var backgroundURL = getAllXpath("//*[contains(@class,'MuiCardContent-root')]//div/div//span[1]/text()", 'nodeValue');
      sliceURL(backgroundURL);
      const sliceURL1 = (data) => {
        var cnt = 0;
        for (let index = 0; index < data.length; index++) {
          if (data[0] != 0) {
            cnt++;
            addElementToDocument('altImages1', cnt);
          }
        }
      };
      var backgroundURL1 = getAllXpath("//*[contains(@class,'MuiCardContent-root')]/div/span[2]", 'nodeValue');
      sliceURL1(backgroundURL1);
    });
    return await context.extract(productDetails, { transform });
  },
};
