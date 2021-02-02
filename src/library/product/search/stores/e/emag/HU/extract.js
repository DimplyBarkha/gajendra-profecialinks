const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    const prices = document.querySelectorAll('div[class="card-item js-product-data"] p[class="product-new-price"]');
    prices.forEach(element => {
      const price = element.textContent;
      if (price) {
        element.setAttribute('price', price.replace('.', ''));
      }
    });
    // id
    const ids = document.querySelectorAll('div[class="card-item js-product-data"] div[class="card-toolbox"] > button[data-productid]');
    ids.forEach(e => {
      if (e.getAttribute('data-product') !== null) {
        const id = JSON.parse(e.getAttribute('data-product')).pnk;
        e.setAttribute('product-sku', id);
      }
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
    // reducing results to 150 and set rank
    const url = window.location.href;
    const allProducts = document.querySelectorAll('div[class="card-item js-product-data"]');
    allProducts.forEach((e, i) => e.setAttribute('rank', `${i + 1}`));
    const last = allProducts.length.toString();
    if (!url.includes('/p2') || !url.includes('/p3') || !url.includes('/p4')) sessionStorage.setItem('item1', last);
    if (url.includes('/p2')) sessionStorage.setItem('item2', last);
    if (url.includes('/p3')) sessionStorage.setItem('item3', last);
    if (url.includes('/p4')) sessionStorage.setItem('item4', last);
    if (sessionStorage.getItem('item4') === null && sessionStorage.getItem('item3') !== null) {
      const trim = 150 - (parseInt(sessionStorage.getItem('item1')) + parseInt(sessionStorage.getItem('item2')));
      allProducts.forEach((e, i) => {
        if (i >= trim) e.setAttribute('trim', '');
      });
    }
    if (sessionStorage.getItem('item4') !== null) {
      const trim = 150 - (parseInt(sessionStorage.getItem('item1')) + parseInt(sessionStorage.getItem('item2')) + parseInt(sessionStorage.getItem('item3')));
      allProducts.forEach((e, i) => {
        if (i >= trim) e.setAttribute('trim', '');
      });
    }
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
