
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'holmesproducts',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[id*="search-result-items"]',
    noResultsXPath: '//div[contains(@class,"responsive-slot no-hits-container")]',
    openSearchDefinition: null,
    domain: 'holmesproducts.com',
    zipcode: '',
  },
};
