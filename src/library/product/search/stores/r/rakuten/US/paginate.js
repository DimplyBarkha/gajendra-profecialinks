
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'rakuten',
    nextLinkSelector: 'a[id="loadMore"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="all-products"]',
    noResultsXPath: '//span[contains(text(),"No Products were found")]',
    openSearchDefinition: null,
    domain: 'rakuten.com',
    zipcode: '',
  },
};
