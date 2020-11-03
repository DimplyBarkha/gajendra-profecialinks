
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'boxed',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '//ul[contains(@class, "g-product-list")]',
    noResultsXPath: '//div[contains(@class, "33b-less")]',
    openSearchDefinition: null,
    domain: 'boxed.com',
    zipcode: '',
  },
};
