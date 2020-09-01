
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'ep-online',
    nextLinkSelector: 'a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="cmsproductlist-component"]',
    noResultsXPath: '//*[contains(@class, "no-hits-headline")]',
    openSearchDefinition: null,
    domain: 'ep-online.ch',
    zipcode: '',
  },
};
