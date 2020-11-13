
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'marionnaud',
    domain: 'marionnaud.ch',
    url: 'https://www.marionnaud.ch/de/search?text={searchTerms}',
    loadedSelector: 'div.product-tile',
    noResultsXPath: null,
    zipcode: '',
  },
};
