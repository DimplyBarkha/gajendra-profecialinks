const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.waitForSelector('.ts-shelf-rate-symbols.ts-sprite');
  await context.evaluate(async function () {
    function checkForProducts (selectorForProducts) {
      return document.querySelector(selectorForProducts) ? document.querySelectorAll(selectorForProducts).length : 0;
    }
    function scrollBy (number) {
      const height = window.scrollY;
      window.scrollTo(0, height + number);
    }

    const numberOfProducts = document.querySelector('.CC-searchCountFiltros .CC-count span')
      ? parseInt(document.querySelector('.CC-searchCountFiltros .CC-count span').innerText)
      : 0;
    if (numberOfProducts > 0) {
      let numberOfSeenProducts;
      do {
        scrollBy(10);
        await new Promise((resolve, reject) => setTimeout(resolve, 10));
        numberOfSeenProducts = checkForProducts('.CC-shelf.shelf-block .shelf-product');
      } while (numberOfProducts !== numberOfSeenProducts);
      await new Promise((resolve, reject) => setTimeout(resolve, 500));
      const productCards = document.querySelector('.CC-shelf.shelf-block .shelf-product') ? document.querySelectorAll('.CC-shelf.shelf-block .shelf-product') : [];

      productCards.forEach((card, index) => {
        card.setAttribute('data-rank-number', index + 1);
        const cardRatingContainer = card.querySelector('.shelf-rating');
        const ratingPercentage = card.querySelector('.ts-shelf-rate-symbols.ts-sprite')
          ? card.querySelector('.ts-shelf-rate-symbols.ts-sprite').style.width.replace('%', '') / 100
          : 0;
        const aggregateRatingNormalized = (ratingPercentage * 5).toFixed(2);
        const div = document.createElement('div');
        div.id = 'aggregateRatingNormalized';
        div.innerHTML = `${aggregateRatingNormalized}`;
        cardRatingContainer.appendChild(div);
      });
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'mambo',
    transform,
    domain: 'mambo.com.br',
    zipcode: '',
  },
  implementation,
};
