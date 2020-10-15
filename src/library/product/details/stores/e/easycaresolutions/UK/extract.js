const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'easycaresolutions',
    transform,
    domain: 'easycaresolutions.co.uk',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    try {
      await context.evaluate(async () => {
        await new Promise(resolve => setTimeout(resolve, 5000));
        await context.waitForSelector('div[class*=page-wrapper]');
      });
    } catch (e) {
      console.log(e);
    };
    await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform });
  },
};
