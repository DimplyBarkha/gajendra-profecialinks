
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PT',
    store: 'auchan',
    domain: 'auchan.pt',
    url: 'https://www.auchan.pt/Frontoffice/search/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
