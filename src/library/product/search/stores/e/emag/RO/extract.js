const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise((resolve, reject) => setTimeout(resolve, 1500));

  await context.evaluate(async function () {
    const price = document.querySelectorAll('div[class="card-item js-product-data"] p[class="product-new-price"]');
    price.forEach((element) => {
      const number = element.textContent.match(/\d+/)[0];
      const firstPrice = number.slice(0, -2);
      const secondPrice = number.slice(-2);
      const currency = element.textContent.match(/[a-zA-Z]+/)[0];
      const price = firstPrice + ',' + secondPrice + ' ' + currency;
      element.setAttribute('price', price);
    });

    // replace . with , in rating
    var rating = document.querySelectorAll('div.card-item.js-product-data div.star-rating.star-rating-read');
    const regex = /\d\.?(\d+)?/gm;

    rating.forEach((element) => {
      var regArray = element.getAttribute('class').match(regex);
      if (regArray[0]) {
        element.setAttribute('rating', regArray[0].replace('.', ','));
      }
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RO',
    store: 'emag',
    transform: transform,
    domain: 'emag.ro',
    zipcode: '',
  },
  implementation,
};
