
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'insight',
    nextLinkXpath: '//div[contains(@class,"stickyPagination show-for-medium-up")]/a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#js-search-product-items',
    noResultsXPath: '//div[contains(text(),"Sorry, no items were found. Please click on one of the other categories above, or try a different search.")]',
    openSearchDefinition: null,
    domain: 'insight.com',
    zipcode: "''",
  },
};