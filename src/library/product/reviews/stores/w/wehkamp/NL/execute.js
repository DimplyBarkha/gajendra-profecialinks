
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'NL',
    store: 'wehkamp',
    domain: 'wehkamp.nl',
    loadedSelector: null,
    noResultsXPath: null,
    reviewUrl: 'https://www.wehkamp.nl/p-{id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
