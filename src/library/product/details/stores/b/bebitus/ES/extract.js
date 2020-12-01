const { cleanUp } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'bebitus',
    transform: cleanUp,
    domain: 'bebitus.com',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
    const { transform } = parameters;
    await context.evaluate(() => {
      const noResultsSelector = document.querySelector('div#mainWrapper a img[src*="error"]');
      if (noResultsSelector) {
        throw new Error('Oops! Error 404 page');
      }
      const variants = [];
      [...document.querySelectorAll('div[class="product-variant-2"] div.product-info')].map((ele) => variants.push(ele.getAttribute('data-product-ean')));
      document.querySelector('h1[itemprop="name"]').setAttribute('variants', variants);

      const isEanSelector = document.querySelector('h2.product-description-ean');
      if (isEanSelector) {
        const sku = isEanSelector.textContent.split(' ')[1].split('-')[0];
        document.querySelector('h1[itemprop="name"]').setAttribute('sku', sku);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
