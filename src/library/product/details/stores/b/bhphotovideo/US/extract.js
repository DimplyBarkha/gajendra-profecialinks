module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'bhphotovideo',
    transform: null,
    domain: 'bhphotovideo.com',
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
