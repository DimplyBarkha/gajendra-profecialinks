
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'londondrugs',
    domain: 'londondrugs.com',
    url: 'https://www.londondrugs.com/search/?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
