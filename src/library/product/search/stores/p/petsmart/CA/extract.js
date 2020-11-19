const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'petsmart',
    transform: transform,
    domain: 'petsmart.ca',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.waitForNavigation();
    await context.evaluate(async () => {
      const closePopupButton = document.querySelector('div._HP_promoModal__close--light');
      if (closePopupButton) {
        // didn't work with context.click() outside context.evaluate()
        // @ts-ignore
        closePopupButton.click();
      }
    });

    await context.evaluate(async () => {
      const currentUrl = window.location.href;
      document.querySelector('body').setAttribute('searchurl', currentUrl);

      // rank
      const products = document.querySelectorAll('ul#search-result-items li');
      products.forEach((product, index) => {
        product.setAttribute('rankorganic', `${index + 1}`);

        // rating
        let ratingValue = 0;
        const stars = product.querySelectorAll('div.rated-stars-container img');
        if (stars.length > 0) {
          stars.forEach(star => {
            let starValue = 0;
            if (star.getAttribute('src').includes('full')) {
              starValue = 1;
            } else {
              starValue = Number(star.getAttribute('src').slice(-11, -10)) / 10;
            }
            ratingValue += starValue;
          });
          const ratingAttribute = ratingValue.toFixed(1);
          product.setAttribute('rating', ratingAttribute);
        }
      });
    });

    return await context.extract(productDetails, { transform });
  },
};
