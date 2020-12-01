
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'pacson',
    domain: 'pacson.se',
    url: 'https://pacson.se/sokresultat?q={searchTerms}',
    loadedSelector: 'ul[class="row product-list"]',
    noResultsXPath: null,
    zipcode: '',
  },
};