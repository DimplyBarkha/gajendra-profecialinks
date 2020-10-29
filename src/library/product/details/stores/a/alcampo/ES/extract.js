
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'alcampo',
    transform: null,
    domain: 'alcampo.es',
    zipcode: '',
  },
  implementation: async (
    { inputString },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    await context.extract(productDetails);
  },
};
