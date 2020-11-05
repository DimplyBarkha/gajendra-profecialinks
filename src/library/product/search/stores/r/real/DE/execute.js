
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'real',
    domain: 'real.de',
    url: 'https://www.real.de/item/search/?search_value=Can&page=3',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
