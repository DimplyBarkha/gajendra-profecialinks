
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'leshopFr',
    domain: 'leshop.ch',
    url: 'https://shop.migros.ch/fr/search?query={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
