
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'linenchest',
    domain: 'linenchest.com',
    url: 'https://www.linenchest.com/fr_ca/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.with-facets div.ais-Hits',
    // noResultsXPath: null,
    zipcode: '',
  },
};
