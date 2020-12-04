
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'staples',
    domain: 'staples.co.uk',
    url: 'https://www.staples.co.uk/search?x=0&y=0&keywords={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
