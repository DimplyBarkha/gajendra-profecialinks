
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'amazonMsCategory',
    domain: 'amazon.de',
    url: 'https://www.amazon.de/gp/bestsellers/*/{searchTerms}?_encoding=UTF8',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
