const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    transform,
    domain: 'nykaa.com',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
    const { transform } = parameters;
    await context.evaluate(() => {
      const nextLinkElement = document.querySelector('head link[rel="next"]');
      if (nextLinkElement) {
        nextLinkElement.remove();
      }
    });
    return await context.extract(productDetails, { transform });
  }
};
