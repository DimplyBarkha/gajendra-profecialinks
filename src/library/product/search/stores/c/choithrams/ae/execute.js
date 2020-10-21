
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ae',
    store: 'choithrams',
    domain: 'choithrams.com',
    url: 'https://www.choithrams.com/en/shop/search/?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
