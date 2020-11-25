const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  // Do a scroll down to load all products
  await context.evaluate(async function () {
    let scrollSelector = document.querySelector('a#show-more-products');
    if (scrollSelector) {
      do {
        scrollSelector.scrollIntoView();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        scrollSelector = document.querySelector('a#show-more-products');
      } while (scrollSelector.getAttribute('style') === null);
    }
  });

  /* await context.evaluate(() => {
    const productUrlAll = document.querySelectorAll('.catalog-list-item');
    let productUrl;
    const ratingSelector = document.querySelectorAll('.catalog-list-stars float-right>span');

    for (let i = 0; i < productUrlAll.length; i++) {
      if (productUrlAll[i].href.includes('https')) {
        productUrl = productUrlAll[i].href;
      } else {
        productUrl = 'https://www.petlove.com.br' + productUrlAll[i].href;
      }

      document.querySelectorAll('.catalog-list-item')[i].setAttribute('productUrl', productUrl);
      document.querySelectorAll('.catalog-list-item')[i].setAttribute('rank', `${i + 1}`);
      document.querySelectorAll('.catalog-list-item')[i].setAttribute('rankOrganic', `${i + 1}`);
    };
  }); */
  return await context.extract(productDetails);
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'petlove',
    transform,
    domain: 'petlove.com.br',
    zipcode: '',
  },
  implementation,
};
