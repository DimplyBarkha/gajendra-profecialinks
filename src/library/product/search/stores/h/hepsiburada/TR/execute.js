module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'hepsiburada',
    domain: 'hepsiburada.com',
    url: 'https://www.hepsiburada.com/ara?q={searchTerms}',
    loadedSelector: 'ul.product-list.results-container.do-flex.list',
    noResultsXPath: '//ul[contains(@class,"no-results")]',
    zipcode: '',
  },
};
