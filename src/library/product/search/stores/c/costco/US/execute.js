
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'costco',
    domain: 'costco.com',
    url: 'https://www.costco.com/CatalogSearch?dept=All&keyword={searchTerms}',
    loadedSelector: '.product-tile-set div[id*="price-"]',
    noResultsXPath: '//div[@id="no-results"]',
    zipcode: '94209',
  },
};
