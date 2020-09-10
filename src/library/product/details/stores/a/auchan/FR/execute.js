
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'auchan',
    domain: 'auchan.fr',
    loadedSelector: 'h1[itemprop="name"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
