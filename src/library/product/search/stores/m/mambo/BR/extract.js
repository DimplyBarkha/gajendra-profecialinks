const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function checkForProducts (selectorForProducts) {
      return document.querySelector(selectorForProducts) ? document.querySelectorAll(selectorForProducts).length : 0;
    }
    function scrollToEndOfElement (element) {
      const height = element.clientHeight;
      window.scrollTo(0, height);
    }

    const numberOfProducts = document.querySelector('.CC-searchCountFiltros .CC-count span')
      ? parseInt(document.querySelector('.CC-searchCountFiltros .CC-count span').innerText)
      : 0;

    let numberOfSeenProducts;

    do {
      scrollToEndOfElement(document.querySelector('.CC-shelf.shelf-block'));
      await new Promise((resolve, reject) => setTimeout(resolve, 500));
      numberOfSeenProducts = checkForProducts('.CC-shelf.shelf-block .shelf-product');
      console.log(`numberOfProducts: ${numberOfProducts} ---- numberOfSeenProducts: ${numberOfSeenProducts}`);
    } while (numberOfProducts !== numberOfSeenProducts);

    const productCards = document.querySelector('.CC-shelf.shelf-block .shelf-product') ? document.querySelectorAll('.CC-shelf.shelf-block .shelf-product') : [];

    productCards.forEach((card, index) => {
      card.setAttribute('data-rank-number', index + 1);
      const cardRatingContainer = card.querySelector('.shelf-rating');
      const ratingPercentage = card.querySelector('.ts-shelf-rate-symbols.ts-sprite').style.width.replace('%', '') / 100;
      const aggregateRatingNormalized = ratingPercentage * 5;
      const div = document.createElement('div');
      div.id = 'aggregateRatingNormalized';
      div.innerHTML = `${aggregateRatingNormalized}`;
      cardRatingContainer.appendChild(div);
    });
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
    implementation,
  },
};
