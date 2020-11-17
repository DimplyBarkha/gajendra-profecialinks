
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NZ',
    store: 'newworld',
    domain: 'newworld.co.nz',
    url: 'https://www.newworld.co.nz/search#e=0&q={searchTerms}',
    loadedSelector: 'ul.search-result-list li',
    noResultsXPath: '//div[@class="no-results"]',
    zipcode: "''",
  },
};
