const { implementation } = require("./sharedExecute")

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    domain: 'kroger.com',
    loadedSelector: 'div.ProductCard-promoContainer',
    noResultsXPath: 'p.no-query-results.heading-l.font-medium.mt-0',
  },
  implementation,
};
