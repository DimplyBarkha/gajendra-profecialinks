const { transform } = require('../../../../../search/shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'misterspex',
    transform: null,
    domain: 'misterspex.de',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      const button = document.querySelector('section.productoffer .checkout-initiator');
      if (button) {
        document.querySelector('h1#page_title').setAttribute('availability', 'In Stock');
      } else {
        document.querySelector('h1#page_title').setAttribute('availability', 'Out of Stock');
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
