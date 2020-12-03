const { implementation } = require('../sharedExecute');

module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'electrictobacconist',
    domain: 'electrictobacconist.co.uk',
    loadedSelector: 'div[class*="product-page-wrapper"]',
    noResultsXPath: '//h1[contains(text(),"page isn\'t available")] | //div[@class="not-found-search"]',
    reviewUrl: null,
    sortButtonSelector: null,
    zipcode: '',
  },
  implementation,
};
