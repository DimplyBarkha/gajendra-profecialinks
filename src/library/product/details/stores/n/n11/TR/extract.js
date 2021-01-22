const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'n11',
    transform,
    domain: 'n11.com',
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
    try {
      await context.waitForSelector(`#p-${inputs.id}`);
      await context.clickAndWaitForNavigation(`#p-${inputs.id} h3`, {}, {});
      return await context.extract(productDetails, { transform });
    } catch (e) {
      return await context.extract(productDetails, { transform });
    }
  },
};
