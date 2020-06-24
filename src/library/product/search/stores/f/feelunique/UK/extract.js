const { transform } = require('../transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addElementToDocument (doc, key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      doc.appendChild(catElement);
    }
  });
  return await context.extract(productDetails, { transform: parameters.transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'feelunique',
    transform,
    domain: 'feelunique.com',
  },
  implementation,
};
