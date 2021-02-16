
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'sephora',
    domain: 'sephora.fr',
    url: 'https://www.sephora.fr/recherche?q={searchTerms}',
    loadedSelector: 'div.product-tile',
    noResultsXPath: '//div[contains(@class, "no-hits-text")]',
    zipcode: '',
  },
};
