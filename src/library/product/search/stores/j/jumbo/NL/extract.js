const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  await context.evaluate(() => {
    const productUrlAll = document.querySelectorAll('.list-methods a.opposite');
    let productUrl;
    const priceArray = [];
    let price;
    const priceSelector = document.querySelectorAll('span.jum-product-price__current-price.d-inline-flex.align-items-start');
    for (let i = 0; i < priceSelector.length; i++) {
      price = priceSelector[i].textContent;

      if (productUrlAll[i].href.includes('https')) {
        productUrl = productUrlAll[i].href;
      } else {
        productUrl = 'https://www.jumbo.com' + productUrlAll[i].href;
      }

      priceArray[0] = price.match('..$');
      priceArray[1] = price.replace(priceArray[0], '');
      price = priceArray[1] + ',' + priceArray[0];

      document.querySelectorAll('.list-methods a.opposite')[i].setAttribute('productUrl', productUrl);
      document.querySelectorAll('div[analytics-tag="product card"]')[i].setAttribute('price', price);
      document.querySelectorAll('div[analytics-tag="product card"]')[i].setAttribute('rank', `${i + 1}`);
      document.querySelectorAll('div[analytics-tag="product card"]')[i].setAttribute('rankOrganic', `${i + 1}`);
    };
    const url = window.location.href;

    document.querySelector('.rw').setAttribute('searchurl', url);
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    transform,
    domain: 'jumbo.com',
    zipcode: '',
  },
  implementation,
};
