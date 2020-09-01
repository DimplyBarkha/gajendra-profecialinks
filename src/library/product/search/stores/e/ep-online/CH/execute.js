
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'ep-online',
    domain: 'ep-online.ch',
    url: 'https://www.ep-online.ch/de/search/?text={searchTerms}',
    loadedSelector: 'div[class*="cmsproductlist-component"]',
    noResultsXPath: '//*[contains(@class, "no-hits-headline")]',
    zipcode: '',
  },
};
