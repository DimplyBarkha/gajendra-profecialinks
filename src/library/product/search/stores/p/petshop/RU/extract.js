const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'petshop',
    transform,
    domain: 'petshop.ru',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.waitForSelector('article.article-catalogue:not([style])');
    await context.evaluate(async function () {
      const allRatingElements = document.querySelectorAll('div[id*="j_rating"]');
      await allRatingElements.forEach(function (element) {
        const formattedRating = element.getAttribute('data-rating').replace('.', ',');
        element.setAttribute('rating-formatted', formattedRating);
      });
    });
    return await context.extract(productDetails, { transform });
  },
};
