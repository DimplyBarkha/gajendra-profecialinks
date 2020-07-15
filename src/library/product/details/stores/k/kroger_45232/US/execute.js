const { implementation } = require('../../kroger/US/sharedExecute');

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'kroger_45232',
    domain: 'kroger.com',
    loadedSelector: 'div.ProductCard-promoContainer',
    noResultsXPath: 'p.no-query-results.heading-l.font-medium.mt-0',
    zipcode: '45232',
  },
  implementation,
};
