
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'leshop',
    domain: 'leshop.ch',
    url: 'https://shop.migros.ch/en/search?query={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
