const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'lenstore',
    transform: transform,
    domain: 'lenstore.fr',
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

var backgroundURL = getAllXpath('//div[@id="relatedShift"]//text()', 'nodeValue');
var description = [];
for(var iteration=0; iteration<backgroundURL.length ; iteration++){
if(backgroundURL[iteration].length > 1){
  description.push(backgroundURL[iteration]);
}
}
// @ts-ignore
description = description.join(" || ");
addElementToDocument('description', description);

  });
  return await context.extract(productDetails, { transform });

}