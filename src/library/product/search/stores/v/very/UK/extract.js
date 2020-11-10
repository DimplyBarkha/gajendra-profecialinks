const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    // add price
    var prices = document.querySelectorAll('a[class="productPrice"]');

    prices.forEach((element) => {
      let price = '';
      if (element.querySelector('dd[class="productPrice"')) {
        price = element.querySelector('dd[class="productPrice"').textContent;
      } else if (element.querySelector('dd[class="productNowPrice"')) {
        price = element.querySelector('dd[class="productNowPrice"').textContent;
      }

      if (price !== '') {
        price = price.replace(/(\r\n|\n|\r)/gm, '');
        const results = price.match(/.\d+\.?(\d+)?/gm);

        element.setAttribute('price', results[0].toString());
      }
    });
  });

  await context.evaluate(async () => {
    // add rank
    var prices = document.querySelectorAll(
      'ul[class="productList"] div[class="productInfo"]');

    prices.forEach((element, index) => {
      element.setAttribute('rank', (index + 1).toString());
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'very',
    transform: transform,
    domain: 'very.co.uk',
    zipcode: '',
  },
  implementation,
};
