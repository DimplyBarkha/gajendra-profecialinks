
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'GLOBAL',
    store: 'amazonMsCategory',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/gp/bestsellers/*/{searchTerms}?_encoding=UTF8',
    loadedSelector: null,
    noResultsXPath: null,
  },
};
