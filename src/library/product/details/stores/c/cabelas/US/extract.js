const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'cabelas',
    transform: cleanUp,
    domain: 'cabelas.com',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
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
  addElementToDocument('altImages', data[index].slice(50, -3));
  }
  };
  var backgroundURL = getAllXpath("(//div[@class='s7thumb'])[1]/@style", 'nodeValue');
  sliceURL(backgroundURL);
});
await context.extract(productDetails);
},
};

