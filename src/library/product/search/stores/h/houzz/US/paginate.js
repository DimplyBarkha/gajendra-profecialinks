module.exports = {
  implements: "product/search/paginate",
  parameterValues: {
    country: "US",
    store: "houzz",
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "[type='application/ld+json']",
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.houzz.com/products/query/{searchTerms}/p/{page}'
    },
    domain: "houzz.com",
    zipcode: "",
  },
};
