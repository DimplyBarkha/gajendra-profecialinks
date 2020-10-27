
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'TigerDirect',
    transform: null,
    domain: 'tigerdirect.com/',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain }, context, dependencies) => {
    await context.evaluate(() => {
      const imgAlt = document.querySelector('a[class="itemImage"] img') ? document.querySelector('a[class="itemImage"] img').alt : null;
      document.body.setAttribute('alt', imgAlt);
    });
    await context.extract(dependencies.productDetails);
  },
};
