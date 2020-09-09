
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'arnotts',
    nextLinkSelector: 'div.products__load-more.js-product-load-more',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//p[@class="no-hits-content-results"]',
    openSearchDefinition: null,
    domain: 'arnotts.ie',
    zipcode: '',
  },
};
