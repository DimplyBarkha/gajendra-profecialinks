const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'reservebar',
    transform,
    domain: 'reservebar.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const pdUrl = await context.evaluate(async () => {
      var url = '';
      const productNode = document.querySelector('div.grid-view-item__image-wrapper a');
      if (productNode) {
        url = productNode.getAttribute('href');
        url = 'https://www.reservebar.com' + url;
      }
      return url;
    });
    if (pdUrl) {
      await context.goto(pdUrl, { timeout: 20000, waitUntil: 'load', checkBlocked: true });
    }
    return await context.extract(productDetails, { transform });
  },
};
