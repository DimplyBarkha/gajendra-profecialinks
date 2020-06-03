
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'uk',
    store: 'morrisons',
    transform: null,
    domain: 'groceries.morrisons.com',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 50000));
    await context.waitForSelector('.bop-title');
  },
};
