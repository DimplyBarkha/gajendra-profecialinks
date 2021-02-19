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
    await context.evaluate(() => {
      const btn = document.querySelector('.jsx-3209444046');
      if (btn) {
        btn.click();
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
