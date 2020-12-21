const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'tennents',
    transform: cleanUp,
    domain: 'new.tennentsdirect.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(() => {
      const productUrl = window.location.href;
      document.querySelector('body').setAttribute('url', productUrl);
    });

    return await context.extract(productDetails, { transform });
  },
};
