
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'parfumswinkel',
    nextLinkSelector: 'li > a[aria-label="Goto next page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.catalog-products',
    noResultsXPath: '//div[contains(@class,"no-results-container col-12")]',
    openSearchDefinition: null,
    domain: 'parfumswinkel.nl',
    zipcode: "''",
  },
};
