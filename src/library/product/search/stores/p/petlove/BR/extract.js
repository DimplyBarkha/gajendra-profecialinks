const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;
  // Do a scroll down to load all products
  await context.evaluate(async function () {
    let scrollSelector = document.querySelector('a#show-more-products');
    if (scrollSelector) {
      do {
        scrollSelector.scrollIntoView();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        scrollSelector = document.querySelector('a#show-more-products');
      } while (scrollSelector.getAttribute('style') === null);
    }
  });

  await context.evaluate(async function () {
    const allProducts = document.querySelectorAll('div[class="catalog-list-item"]');
    allProducts.forEach(element => {
      const starsSelector = element.querySelectorAll('div.catalog-list-stars.float-right > span.icon-star , span.icon-star-half');
      // Create AggregateRating based on stars span
      if (starsSelector) {
        let starsScore = Number();
        starsSelector.forEach(stars => {
          if (stars.className === 'icon-star') {
            starsScore += 1;
          } else if (stars.className === 'icon-star-half') {
            starsScore += 0.5;
          }
        });
        if (starsScore > 0) {
          element.setAttribute('ratingvalue', `${starsScore}`);
        }
      }
    });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'petlove',
    transform,
    domain: 'petlove.com.br',
    zipcode: '',
  },
  implementation,
};
