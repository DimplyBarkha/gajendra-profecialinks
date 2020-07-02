const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazon_10023',
    transform,
    domain: 'amazon.com',
    zipcode: '10023',
  },
  implementation: async ({ url }, { transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      let manufacturerDescription = document.querySelector('div[id="aplus"] div[data-cel-widget="aplus"]');
      manufacturerDescription = manufacturerDescription ? manufacturerDescription.innerText.trim() : '';
      if (manufacturerDescription) {
        addElementToDocument('pd_enhancedContent', manufacturerDescription);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
