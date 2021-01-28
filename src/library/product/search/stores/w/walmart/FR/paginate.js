
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'walmart',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#product-results div[data-automation="product"]',
    noResultsXPath: '//h1[@data-automation="null-results-message"]',
    openSearchDefinition: {
      template: 'https://www.walmart.ca/recherche?q={searchTerms}&p={page}',
      pageOffset: 0,
      pageStartNb: 1,
    },
    domain: 'walmart.ca',
    zipcode: "''",
  },
};
