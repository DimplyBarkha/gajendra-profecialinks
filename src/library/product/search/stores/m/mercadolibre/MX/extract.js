const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'mercadolibre',
    transform,
    domain: 'mercadolibre.com.mx',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    return await context.extract(productDetails, { transform });
  },
};
