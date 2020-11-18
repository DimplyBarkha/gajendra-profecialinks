
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'parfumswinkel',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.col.p-0.pl-lg-1.catalog-products',
    noResultsXPath: '//div[contains(@class,"no-results-container col-12")]',
    openSearchDefinition: null,
    domain: 'parfumswinkel.nl',
    zipcode: "''",
  },
};
