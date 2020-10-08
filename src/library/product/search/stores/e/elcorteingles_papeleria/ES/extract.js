const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_papeleria',
    transform,
    domain: 'elcorteingles.es',
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
    await context.waitForSelector('img[class*="lazyload"]');
    return await context.extract(productDetails, { transform });
  },
};
