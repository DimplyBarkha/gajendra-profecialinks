const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'krefel',
    transform: transform,
    domain: 'krefel.be',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const productBoxes = document.querySelectorAll('div.col-md-4.product') ? document.querySelectorAll('div.col-md-4.product') : 0;
      const numberOfProducts = productBoxes.length;

      for (let i = 0; i < numberOfProducts; i++) {
        if (productBoxes[i].querySelector('div.rating-wrap').querySelector('div.rating')) {
          let fullRate = productBoxes[i].querySelector('div.rating').querySelectorAll('span.plug.filled').length;
          if (fullRate !== 5 && !productBoxes[i].querySelector('div.rating').querySelectorAll('span.plug')[fullRate].querySelector('svg').querySelectorAll('path')[0].className.baseVal) {
            fullRate = fullRate + 0.5;
          }
          fullRate = fullRate.toString().replace('.', ',');
          document.querySelectorAll('div.top-content')[i].setAttribute('rating', fullRate);
        };
      };
    });

    await context.evaluate(async function () {
      const numberOfResults = document.querySelectorAll('div[class^="col-md-4"]');
      for (let x = 0; numberOfResults.length > x; x++) {
        numberOfResults[x].classList.replace('col-md-4', 'col-md-1');
        // @ts-ignore
        numberOfResults[x].style.height = '20px';
      }
      window.scroll(1, 1);
    });

    await context.evaluate(async function () {
      const allProducts = document.querySelectorAll('div[class^="col-md-1"]');
      let x;
      for (x = 0; allProducts.length - 1 >= x; x++) {
        allProducts[x].setAttribute('count', `${x + 1}`);
      }
    });

    return await context.extract(productDetails);
  },
};
