module.exports = {
  implements: "product/search/paginate",
  parameterValues: {
    country: "US",
    store: "houzz",
    nextLinkSelector: '.hz-pagination-next-page',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "[type='application/ld+json']",
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: "houzz.com",
    zipcode: "",
  },
};
