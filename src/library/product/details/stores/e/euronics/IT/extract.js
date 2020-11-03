
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'euronics',
    transform: null,
    domain: 'euronics.it',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.click('.productDetail__image');
    await context.extract(productDetails);
  },
};
