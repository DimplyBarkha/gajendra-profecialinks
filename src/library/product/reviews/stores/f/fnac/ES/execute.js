
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'ES',
    store: 'fnac',
    domain: 'fnac.es',
    loadedSelector: 'section.js-customer-reviews',
    noResultsXPath: '//body[@class="home-page"]',
    reviewUrl: 'null',
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
