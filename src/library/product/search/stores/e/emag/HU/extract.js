const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    const prices = document.querySelectorAll('div[class="card-item js-product-data"] p[class="product-new-price"]');
    prices.forEach(element => {
      const price = element.textContent;
      if (price) {
        element.setAttribute('price', price.replace('.', ','));
      }
    });

    // replace . with , in rating
    var rating = document.querySelectorAll('div.card-item.js-product-data div.star-rating.star-rating-read');
    const regex = /\d\.?(\d+)?/gm;

    rating.forEach((element) => {
      var regArray = element.getAttribute('class').match(regex);

      if (regArray[0]) {
        element.setAttribute('rating', regArray[0].toString().replace('.', ','));
      }
    });
  });

  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'HU',
    store: 'emag',
    transform: transform,
    domain: 'emag.hu',
    zipcode: '',
  },
  implementation,
};
