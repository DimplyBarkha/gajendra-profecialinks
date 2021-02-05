const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise((resolve, reject) => setTimeout(resolve, 5000));

  await context.evaluate(async function () {
    const price = document.querySelectorAll('div#card_grid div.card-section-wrapper.js-section-wrapper p[class="product-new-price"]');
    price.forEach((element) => {
      const number = element.textContent.match(/\d+/)[0];
      const firstPrice = number.slice(0, -2);
      const secondPrice = number.slice(-2);
      const currency = element.textContent.match(/[a-zA-Z]+/)[0];
      const price = firstPrice + ',' + secondPrice + ' ' + currency;
      element.setAttribute('price', price);
    });

    // id
    const ids = document.querySelectorAll('div#card_grid div.card-section-wrapper.js-section-wrapper div[class="card-toolbox"] > button[data-productid]');
    ids.forEach(e => {
      if (e.getAttribute('data-product') !== null) {
        const id = JSON.parse(e.getAttribute('data-product')).pnk;
        e.setAttribute('product-sku', id);
      }
    });

    // name
    const names = document.querySelectorAll('div#card_grid div.card-section-wrapper.js-section-wrapper h2.product-title-zone');
    names.forEach(e => {
      if (e.innerText) {
        const name = e.innerText.trim();
        e.setAttribute('product-name', name);
      }
    });

    // replace . with , in rating
    var rating = document.querySelectorAll('div#card_grid div.card-section-wrapper.js-section-wrapper div.star-rating.star-rating-read');
    const regex = /\d\.?(\d+)?/gm;

    rating.forEach((element) => {
      var regArray = element.getAttribute('class').match(regex);
      if (regArray[0]) {
        element.setAttribute('rating', regArray[0].replace('.', ','));
      }
    });
  });

  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
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
