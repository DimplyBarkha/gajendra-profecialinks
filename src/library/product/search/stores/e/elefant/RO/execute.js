
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RO',
    store: 'elefant',
    domain: 'elefant.ro',
    url: 'https://www.elefant.ro/search?SearchTerm={searchTerms}',
    loadedSelector: 'div.lazy img',
    noResultsXPath: '//div[@class="no-search-result"]//h1',
    zipcode: '',
  },
};
