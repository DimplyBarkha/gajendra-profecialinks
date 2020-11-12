async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    const productUrlAll = document.querySelectorAll('.list-methods a.opposite');
    let productUrl;
    for (let i = 0; i < productUrlAll.length; i++) {
      if (productUrlAll[i].href.includes('https')) {
        productUrl = productUrlAll[i].href;
      } else {
        productUrl = 'https://www.bol.com' + productUrlAll[i].href;
      }

      document.querySelectorAll('.list-methods a.opposite')[i].setAttribute('productUrl', productUrl);
      document.querySelectorAll('div[analytics-tag="product card"]')[i].setAttribute('rank', `${i + 1}`);
      document.querySelectorAll('div[analytics-tag="product card"]')[i].setAttribute('rankOrganic', `${i + 1}`);
    };
  });
  return await context.extract(productDetails);
};
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    transform: null,
    domain: 'jumbo.com',
    zipcode: '',
  },
  implementation,
};
