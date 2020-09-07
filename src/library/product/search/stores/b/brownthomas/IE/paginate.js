
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'brownthomas',
    nextLinkSelector: 'div.js-product-load-more',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul#product-search-result-items li:nth-last-child(1)',
    noResultsXPath: '//p[contains(@class,"no-hits-content-results")]',
    openSearchDefinition: null,
    domain: 'brownthomas.com',
    zipcode: '',
  },
};
