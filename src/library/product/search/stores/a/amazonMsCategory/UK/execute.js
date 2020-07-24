
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'amazonMsCategory',
    domain: 'amazon.co.uk',
    url: 'https://www.amazon.co.uk/gp/bestsellers/*/{searchTerms}?_encoding=UTF8',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
