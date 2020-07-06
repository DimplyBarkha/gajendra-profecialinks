const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'amazonMweb',
    transform,
    domain: 'amazon.fr',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    let enhancedContent = document.querySelector('div#aplus');
    // @ts-ignore
    enhancedContent = enhancedContent ? enhancedContent.innerText : '';
    addElementToDocument('a_enhancedContent', enhancedContent);
    addElementToDocument('a_pageTimestamp', (new Date()).toISOString().replace(/[TZ]/g, ' '));
  });
  return await context.extract(productDetails, { transform: parameters.transform });
}
