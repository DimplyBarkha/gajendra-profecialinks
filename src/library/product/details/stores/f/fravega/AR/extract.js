const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AR',
    store: 'fravega',
    transform: transform,
    domain: 'fravega.com',
    zipcode: '',
  },
  implementation: async ({ id }, { transform }, context, { productDetails: data }) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    if (id) {
      console.log("Inside id ");
      await context.waitForSelector('ul[name=itemsGrid] > li:nth-child(1)');
      await context.click('ul[name=itemsGrid] > li:nth-child(1)');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    return await context.extract(data, { transform });
  },
};
