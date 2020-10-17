const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'kalunga',
    transform: transform,
    domain: 'kalunga.com.br',
    zipcode: '',
  },
  async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(() => {
    });

    return await context.extract(productDetails, { transform });
  },
};
