const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UA',
    store: 'metro',
    transform: cleanUp,
    domain: 'metro.zakaz.ua',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.click('.jsx-3209444046');

    return await context.extract(productDetails, { transform });
  },
};
