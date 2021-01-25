
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'JDSports',
    domain: 'jdsports.co.uk',
    url: 'https://www.jdsports.co.uk/search/{searchTerms}/',
    loadedSelector:'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
