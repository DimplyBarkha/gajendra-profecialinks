
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'zalando',
    domain: 'zalando.de',
    url: 'https://zalando.de/katalog/?q={searchTerms}',
    loadedSelector: 'div[class*="cat_catalog"]',
    noResultsXPath: '//div[contains(@class, "noSearchResults")] | //div[contains(@class, "404")] | //div[contains(@class, "error")]',
    zipcode: '',
  },
};
