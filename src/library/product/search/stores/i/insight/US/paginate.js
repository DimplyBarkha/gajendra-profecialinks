
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'insight',
    nextLinkSelector: 'li#nav-page__next-page nav-page__desktop',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#js-search-product-items',
    noResultsXPath: '//div[contains(text(),"Sorry, no items were found. Please click on one of the other categories above, or try a different search.")]',
    openSearchDefinition: null,
    domain: 'insight.com',
    zipcode: "''",
  },
};