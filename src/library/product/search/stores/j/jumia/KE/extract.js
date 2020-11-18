const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'KE',
    store: 'jumia',
    transform,
    domain: 'jumia.co.ke',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    const closeNewsletterBtn = await context.evaluate(async function () {
      document.querySelector('button[data-track-onclick="popupClose"]');
    });
    if (closeNewsletterBtn) {
      await context.click('button[data-track-onclick="popupClose"]');
    }

    await context.evaluate(async () => {
      const { products } = window.__STORE__ || [];
      products.forEach((product) => {
        const productElem = document.querySelector(`a[data-id="${product.sku}"]`);
        productElem.setAttribute('img', product.image);
      });
    });

    return await context.extract(productDetails, { transform });
  },
};
