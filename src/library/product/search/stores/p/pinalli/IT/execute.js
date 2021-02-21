
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'pinalli',
    domain: 'pinalli.it',
    url: 'https://www.pinalli.it/prodotti?q={searchTerms}',
    loadedSelector: '.card__body a img',
    noResultsXPath: null,
    zipcode: '',
  },
};
