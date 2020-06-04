
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'morrisons',
    transform: null,
    domain: 'groceries.morrisons.com',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 100000));
    await context.extract(productDetails);
  },
};
