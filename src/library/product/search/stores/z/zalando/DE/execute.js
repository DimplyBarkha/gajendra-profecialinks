
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'zalando',
    domain: 'zalando.de',
    url: 'https://zalando.de/herren/?q={searchTerms}',
    loadedSelector: 'div[class*="cat_catalog"]',
    noResultsXPath: '//div[contains(@class, "noSearch")]//span[contains(text(), "Du hast gesucht nach")] | //div[contains(@class, "404")] | //div[contains(@class, "error")]',
    zipcode: '',
  },
};
