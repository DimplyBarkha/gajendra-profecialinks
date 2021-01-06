const { implementation } = require('../sharedExecute');

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'electrictobacconist',
    domain: 'electrictobacconist.co.uk',
    url: 'https://www.electrictobacconist.co.uk',
    loadedSelector: 'div.product__details__holder',
    noResultsXPath: '//h1[contains(text(),"0 results found")] | //div[@class="product-listings--empty"]',
    zipcode: '',
  },
  implementation,
};
