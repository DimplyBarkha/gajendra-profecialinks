const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'netonnet',
    transform, // middle ware for processing data
    domain: 'netonnet.no',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));
    await context.evaluate(async function () {
      const overlay = document.getElementById('headingOne');
      if (overlay !== undefined) {
        overlay.click();
      }
    });
  
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  }
};