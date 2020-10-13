
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'amazonMsCategory',
    domain: 'amazon.ca',
    url: 'https://www.amazon.ca/gp/bestsellers/*/{searchTerms}?_encoding=UTF8',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
