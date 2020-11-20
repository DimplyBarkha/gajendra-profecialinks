
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SA',
    store: 'carrefour',
    nextLinkSelector: 'a.plp-pagination__navnext',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section.plp-list .plp-list__item',
    noResultsXPath: '//p[@class="not-found__para"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'carrefourksa.com',
    zipcode: "''",
  },
};
