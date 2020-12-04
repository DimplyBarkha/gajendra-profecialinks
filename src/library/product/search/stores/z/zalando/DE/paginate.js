
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'zalando',
    nextLinkSelector: 'a[title="nächste Seite"][href*="/"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="cat_catalog"]',
    noResultsXPath: '//div[contains(@class, "noSearch")]//span[contains(text(), "Du hast gesucht nach")] | //div[contains(@class, "404")] | //div[contains(@class, "error")]',
    openSearchDefinition: null,
    domain: 'zalando.de',
    zipcode: '',
  },
};
