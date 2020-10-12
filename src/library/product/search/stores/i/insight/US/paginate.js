
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'insight',
    nextLinkSelector: 'div.pagination-container > ul.pagination > li:last-child > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#columns medium-9 result-col js-search-load-result',
    noResultsXPath: '//div[contains(text(),"Sorry, no items were found. Please click on one of the other categories above, or try a different search.")]',
    openSearchDefinition: null,
    domain: 'insight.com',
    zipcode: "''",
  },
};