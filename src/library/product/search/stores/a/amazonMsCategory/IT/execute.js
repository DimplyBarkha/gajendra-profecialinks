
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'amazonMsCategory',
    domain: 'amazon.it',
    url: 'https://www.amazon.it/gp/bestsellers/*/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
