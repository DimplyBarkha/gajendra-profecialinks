async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;

  await context.evaluate(() => {
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
  });
  await context.extract(productDetails);
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'petlove',
    transform: null,
    domain: 'petlove.com.br',
    zipcode: "''",
  },
  implementation,
};
