const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'microspot',
    transform,
    domain: 'microspot.ch',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    try {
      await context.waitForSelector('span.tD6MRI');
      await context.click('span.tD6MRI');
    } catch (error) {
      console.log('no variant drop down');
    }
    await new Promise(resolve => setTimeout(resolve, 10000));
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
