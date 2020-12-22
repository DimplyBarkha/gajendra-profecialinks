
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'boxed',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="ab4-less"] > ul[class*="g-product-list"]',
    noResultsXPath: '//div[contains(@class, "33b-less")]',
    openSearchDefinition: null,
    domain: 'boxed.com',
    zipcode: '',
  },
};
