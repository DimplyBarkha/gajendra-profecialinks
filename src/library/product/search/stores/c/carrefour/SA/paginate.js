
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SA',
    store: 'carrefour',
    nextLinkSelector: 'a.plp-pagination__navnext',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="-jyyiad"]',
    noResultsXPath: '//h2[@data-testid="no-result-text"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'carrefourksa.com',
    zipcode: "''",
  },
};
