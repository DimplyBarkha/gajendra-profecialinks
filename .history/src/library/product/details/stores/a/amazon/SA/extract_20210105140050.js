<<<<<<< HEAD
const { transform } = require('./shared');
=======

const { transform } = require('../../../../sharedAmazon/transformNew');
const { implementation } = require('../../../a/amazon/US/extract');
>>>>>>> origin/merged-amazon-sources

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SA',
    store: 'amazon',
    transform,
    domain: 'amazon.sa',
  },
<<<<<<< HEAD
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const a = document.querySelectorAll('#feature-bullets > ul > li');
      const b = document.querySelectorAll('.a-row.a-expander-container.a-expander-inline-container > div > ul > li');
      if (a.length && b.length) addElementToDocument('descriptionBullets', a.length - 1 + b.length);
      else if (a.length) addElementToDocument('descriptionBullets', a.length - 1);
      else if (b.length) addElementToDocument('descriptionBullets', b.length);
      else addElementToDocument('descriptionBullets', '');
      const text = document.querySelector('#availability span').innerText;
      if (text === 'In Stock.' || text.includes('Availability') || text.includes('in stock')) addElementToDocument('Availability', 'In Stock');
      else addElementToDocument('Availability', 'Out of Stock');
    });
    return await context.extract(productDetails, { transform });
  },
=======
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
    goto: 'action:navigation/goto',
  },
  implementation,
>>>>>>> origin/merged-amazon-sources
};
