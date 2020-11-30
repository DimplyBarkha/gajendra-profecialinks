const { implementation } = require('../sharedExecute');

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'electrictobacconist',
    domain: 'electrictobacconist.com',
    url: 'https://www.electrictobacconist.com/',
    loadedSelector: 'div.product__details__holder',
    noResultsXPath: '//h1[contains(text(),"0 results found")] | //div[@class="product-listings--empty"]',
    zipcode: '',
  },
  implementation,
};
