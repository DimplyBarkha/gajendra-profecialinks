const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CZ',
    store: 'pilulka',
    transform: transform,
    domain: 'pilulka.cz',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(async () => {
      const searchUrl = window.location.href;
      document.querySelector('body').setAttribute('searchurl', searchUrl);

      const products = document.querySelectorAll('div#product-list div[class*="product-card__border"]');
      products.forEach(product => {
        let ratingValue = 0;
        const stars = product.querySelectorAll('li[class*="star"] div');
        if (stars.length > 0) {
          stars.forEach(star => {
            const starValue = Number(star.getAttribute('style').replace(/[^\d]/g, ''));
            ratingValue += starValue;
          });
          const ratingAttribute = (ratingValue / 100).toFixed(1).replace('.', ',');
          product.setAttribute('rating', ratingAttribute);
        }
      });
    });

    return await context.extract(productDetails, { transform });
  },
};
