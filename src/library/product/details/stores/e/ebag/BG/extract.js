const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BG',
    store: 'ebag',
    transform,
    domain: 'ebag.bg',
    zipcode: '',
  },
  // implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
  //   try {
  //     await new Promise(resolve => setTimeout(resolve, 5000));
  //     await context.click('li#react-tabs-2');
  //     await context.waitForSelector('div[class*=energy-values]');
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   await new Promise(resolve => setTimeout(resolve, 10000));
  //   return await context.extract(productDetails, { transform });
  // },
};
