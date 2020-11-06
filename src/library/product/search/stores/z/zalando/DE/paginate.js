
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'zalando',
    nextLinkSelector: 'a[title="next page"][href*="/"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="cat_catalog"]',
    noResultsXPath: '//div[contains(@class, "noSearchResults")] | //div[contains(@class, "404")]',
    openSearchDefinition: null,
    domain: 'zalando.de',
    zipcode: '',
  },
};
