
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'n11',
    transform: null,
    domain: 'n11.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain }, context, dependencies) => {
    await context.evaluate(() => {
      const imgAlt = document.querySelector('.unf-p-img');
      document.body.setAttribute('imgAlt', imgAlt ? imgAlt.alt : null);
    });
    await context.extract(dependencies.productDetails);
  },
};
