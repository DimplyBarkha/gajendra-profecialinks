const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'prodirectsoccer',
    transform,
    domain: 'prodirectsoccer.com',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const popup = await context.evaluate(() => {
      return Boolean(document.querySelector('.taxfree-popup'));
    });
    if (popup) {
      await context.click('.taxfree-popup button');
    }
    return await context.extract(productDetails, { transform });
  },
};
