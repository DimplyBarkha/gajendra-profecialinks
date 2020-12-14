const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'teknosa',
    transform,
    domain: 'teknosa.com',
    zipcode: '',
  },
  implementation: async (
    { url },
    { country, domain },
    context,
    dependencies,
  ) => {
    await context.evaluate(() => {
     
    });
    await context.extract(dependencies.productDetails);
  },
};