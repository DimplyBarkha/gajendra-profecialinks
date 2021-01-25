const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'worldofsweets',
    transform: transform,
    domain: 'worldofsweets.de',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      const ratings = document.querySelectorAll('div.details-tobasket-container span.product-rating-stars');
      if (ratings) {
        Array.from(ratings).forEach(rating => {
          const stars = rating.querySelectorAll('i.fa');
          let ratingVal = 0;

          [...stars].forEach(star => {
            if (star.getAttribute('class').includes('fa-star')) ++ratingVal;
          });
          rating.setAttribute('custom_rating', ratingVal);
        });
      }
    });
    await context.evaluate(async function () {
      const popUps = document.getElementById('uc-btn-accept-banner');
      if (popUps) popUps.click();
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
