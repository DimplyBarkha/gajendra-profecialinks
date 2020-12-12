
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'mediamarkt',
    domain: 'mediamarkt.de',
    url: 'https://www.mediamarkt.de/de/search.html?query={searchTerms}',
    loadedSelector: 'div[class^="ProductsList"], ul[class^="products-list"]',
    noResultsXPath: '//div[contains(@class, "ZeroResultsView")]|//nav[contains(@class, "dy-nav")]',
    zipcode: '',
  },
};
