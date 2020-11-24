
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'jdsports',
    domain: 'jdsports.co.uk',
    url: 'https://www.jdsports.co.uk/search/%20{searchTerms}%20/?max=72',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
