module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'costco',
    domain: 'costco.ca',
    url: 'https://www.costco.ca/CatalogSearch?dept=All&keyword={searchTerms}',
    loadedSelector: '.product-tile-set div[id*="price-"]',
    noResultsXPath: '//div[@id="no-results"]',
    zipcode: 'M5V 2A5',
  },
};
