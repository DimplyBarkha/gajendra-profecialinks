
const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'ocado',
    transform,
    domain: 'ocado.com',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(() => {
      if (document.querySelector('div.nf-resourceNotFound')) {
        throw new Error('Not a product Page');
      }
    });
    await context.extract(productDetails);
  },
};
