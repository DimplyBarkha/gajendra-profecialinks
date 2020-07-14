
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'amazonMsCategory',
    domain: 'amazon.es',
    url: 'https://www.amazon.es/gp/bestsellers/*/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
