
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'linenchest',
    domain: 'linenchest.com',
    url: 'https://www.linenchest.com/en_ca/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'ol.ais-Hits-list li.ais-Hits-item',
    noResultsXPath: '(//div[@id="instant-empty-results-container"]//div[@class="no-results"]//div)[1]',
    zipcode: '',
  },
};
