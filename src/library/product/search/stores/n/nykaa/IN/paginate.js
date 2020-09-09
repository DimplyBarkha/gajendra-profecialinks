
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="main-product-listing-page"]',
    noResultsXPath: '//div[@class="page-title-search-result"]',
    openSearchDefinition: null,
    domain: 'nykaa.com',
    zipcode: '',
  },
};
