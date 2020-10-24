
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'pacson',
    domain: 'pacson.se',
    url: 'https://pacson.se/sokresultat?q=dispenser%20servett',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
