
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RO',
    store: 'elefant',
    domain: 'elefant.ro',
    url: 'https://www.elefant.ro/search?SearchTerm={searchTerms}&StockAvailability=true',
    loadedSelector: 'img.product-image',
    noResultsXPath: '//div[@class="no-search-result"]//h1',
    zipcode: '',
  },
};
