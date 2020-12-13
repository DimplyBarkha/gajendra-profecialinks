
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'jdsports',
    domain: 'jdsports.co.uk',
    url: 'https://www.jdsports.co.uk/search/{searchTerms}/?max=72',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
