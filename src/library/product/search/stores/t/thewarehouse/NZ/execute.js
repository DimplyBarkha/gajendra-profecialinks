
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NZ',
    store: 'thewarehouse',
    domain: 'thewarehouse.co.nz',
    url: 'https://www.thewarehouse.co.nz/search?q={searchTerms}',
    loadedSelector: 'ul#search-result-items .grid-tile',
    noResultsXPath: '//div[@class="no-search-result"]',
    zipcode: "''",
  },
};
