
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'iqos',
    domain: 'iqos.com',
    url: 'https://it.iqos.com/en/shop',
    loadedSelector: 'article figure.ggt-list-add-to-cart',
    noResultsXPath: null,
    zipcode: '',
  },
};
