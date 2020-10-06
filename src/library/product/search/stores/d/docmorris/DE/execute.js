module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'docmorris',
    domain: 'docmorris.de',
    url: 'https://www.docmorris.de/search?resultsPerPage=144&query={searchTerms}',
    loadedSelector: '#obligatories',
    noResultsXPath: '//*[contains(text(),"Ihrem Suchbegriff kein")]',
    zipcode: '',
  },
};
