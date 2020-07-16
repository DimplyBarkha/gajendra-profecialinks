const { implementation } = require('../../kroger/US/sharedExecute');

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'kroger_45044',
    domain: 'kroger.com',
    loadedSelector: 'div.ProductCard-promoContainer',
    noResultsXPath: 'p.no-query-results.heading-l.font-medium.mt-0',
    zipcode: '45044',
  },
  implementation,
};
