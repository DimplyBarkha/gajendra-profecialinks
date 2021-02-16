
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'FR',
    store: 'boulanger',
    domain: 'boulanger.com',
    loadedSelector: null,
    noResultsXPath: null,
    reviewUrl: 'https://www.boulanger.com/ref/{id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
