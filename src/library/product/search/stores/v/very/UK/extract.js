const { transform } = require('../../../../shared');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    //code
    var prices = document.querySelectorAll('a[class="productPrice"]');

    prices.forEach((element) => {
      let price = '';
      if (element.querySelector('dd[class="productPrice"')){
        price = element.querySelector('dd[class="productPrice"').textContent;
      }
      else if (element.querySelector('dd[class="productNowPrice"')){
        price = element.querySelector('dd[class="productNowPrice"').textContent;
      }

      element.setAttribute('price', price.replace(/(\r\n|\n|\r)/gm,""));
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
