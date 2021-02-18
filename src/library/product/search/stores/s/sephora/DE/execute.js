
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'sephora',
    domain: 'sephora.de',
    url: 'https://www.sephora.de/suche?q={searchTerms}&sz=150',
    loadedSelector: 'div.product-tile',
    noResultsXPath: '//div[contains(@class, "no-hits-text")]',
    zipcode: '',
  },
};
