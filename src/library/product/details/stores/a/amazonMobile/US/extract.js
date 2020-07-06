const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonMobile',
    transform,
    domain: 'amazon.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      const element = document.getElementById('detail-bullets');
      element && element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    });
    return await context.extract(productDetails, { transform });
  },
};
