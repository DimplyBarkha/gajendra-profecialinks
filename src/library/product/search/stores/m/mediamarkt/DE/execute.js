
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'mediamarkt',
    domain: 'mediamarkt.de',
    url: 'https://www.mediamarkt.de/de/search.html?query={searchTerms}',
    loadedSelector: 'div[class^="ProductsList"]',
    noResultsXPath: '//div[contains(@class, "ZeroResultsView")]',
    zipcode: '',
  },
};
