
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AE',
    store: 'sprii',
    domain: 'sprii.ae',
    url: 'https://www.sprii.ae/ar/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.search.results',
    noResultsXPath: '//div[contains(@class, "message notice")]//text()',
    zipcode: '',
  },
};
