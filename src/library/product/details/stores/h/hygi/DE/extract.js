const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'hygi',
    transform: transform,
    domain: 'hygi.de',
    zipcode: '',
  },
  implementation
};

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
  
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

  function addElementToDocument(key, value) {
    const catElement = document.createElement('div');
    catElement.id = key;
    catElement.textContent = value;
    catElement.style.display = 'none';
    document.body.appendChild(catElement);
    }

  var VariantData = getAllXpath('//span[@class="toggle variant selected"]/text()|//span[@class="variant-text text"]/text()','nodeValue');
  var Variants = VariantData.join('|')
  addElementToDocument('VariantInfo', Variants);
  });

  return await context.extract(productDetails, { transform });
}