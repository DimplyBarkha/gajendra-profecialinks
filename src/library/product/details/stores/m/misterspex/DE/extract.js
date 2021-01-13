const { transform } = require('../../../../../details/shared');
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
    console.log(parameters);
    await context.evaluate(() => {
      const button = document.querySelector("p.spex-p");
      if (button) {
        document.querySelector('div.spex-h3').setAttribute('availability', 'Out of Stock');
      } else {
        document.querySelector('div.spex-card').setAttribute('availability', 'In Stock');
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
