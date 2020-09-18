

const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'krefel',
    transform,
    domain: 'krefel.be',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.evaluate(async function () {
      const products = window.__data.reduxAsyncConnect.reduxAsyncConnect[2].body.products;

      products.forEach((prod, index) => {
        const href = prod.url;
        const selector = `a[href*="${href}"]`;
        const el = document.querySelector(selector);
        if (!el) return;
        const image = prod.images[0]
        el.setAttribute('image-url', image.url);
      });
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;

    return await context.extract(productDetails, { transform });
  },
};
